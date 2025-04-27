# app/services/auth_service.py

import random
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth_schemas import (
    RegisterSchema,
    LoginSchema,
    VerifyOTPSchema,
    UpdateRoleSchema,
    DeleteUserSchema,
    ResetPasswordOTPSchema,
    ResetPasswordSchema
)
from app.utils.jwt import AuthJWT
from app.utils.auth_utils import hash_password
from app.utils.email_utils import send_register_mail

# JWT Blacklist to manage invalidated tokens
BLACKLIST = set()

class AuthService:

    @staticmethod
    async def register_user(db: AsyncSession, user_data: RegisterSchema):
        result = await db.execute(select(User).where(User.email == user_data.email))
        existing_user = result.scalars().first()

        if existing_user:
            return {"success": False, "message": "Email already in use"}

        new_user = User(
            title=user_data.title,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            company_name=user_data.company_name,
            email=user_data.email,
            password_hash=hash_password(user_data.password).decode('utf-8')
        )

        otp_code = str(random.randint(100000, 999999))
        new_user.otp = otp_code

        db.add(new_user)
        await db.commit()

        try:
            await send_register_mail(new_user.email, otp_code, "Registration")
            return {"success": True, "message": "OTP sent to your email! Please check your email"}
        except Exception as e:
            print(f"Failed to send email: {e}")
            return {"success": False, "message": "Failed to send OTP email"}

    @staticmethod
    async def login_user(db: AsyncSession, login_data: LoginSchema):
        result = await db.execute(select(User).where(User.email == login_data.email))
        user = result.scalars().first()

        if not user:
            return {"success": False, "message": "Invalid email or password"}

        try:
            if bcrypt.checkpw(login_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
                access_token = AuthJWT.create_access_token(identity={"sub": str(user.id)})
                refresh_token = AuthJWT.create_refresh_token(identity={"sub": str(user.id)})

                return {
                    "success": True,
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user_role": user.role
                }
        except ValueError as e:
            print(f"Error with password hash: {e}")
            return {"success": False, "message": "Invalid email or password"}

        return {"success": False, "message": "Invalid email or password"}

    @staticmethod
    async def logout_user(current_user):
        jti = current_user.get("jti")
        BLACKLIST.add(jti)
        return {"success": True, "message": "Logout successful."}

    @staticmethod
    async def verify_otp(db: AsyncSession, otp_data: VerifyOTPSchema):
        try:
            result = await db.execute(select(User).where(User.email == otp_data.email))
            user = result.scalars().first()

            if not user:
                return {"success": False, "message": "User not found"}

            if user.otp != otp_data.otp:
                return {"success": False, "message": "Invalid OTP"}

            user.is_verified = True
            user.is_active = True
            await db.commit()

            return {"success": True, "message": "OTP verified successfully"}
        except Exception as e:
            print(f"verify otp error: {str(e)}")
            return {"success": False, "message": "OTP verification failed"}

    @staticmethod
    async def update_user_role(db: AsyncSession, role_data: UpdateRoleSchema, current_user):
        try:
            user_id = current_user.get("sub")
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()

            if 'admin' not in user.role:
                return {"success": False, "message": "Only Admin can access this"}

            result = await db.execute(select(User).where(User.email == role_data.email))
            target_user = result.scalars().first()

            if not target_user:
                return {"success": False, "message": "User not found"}

            target_user.role = role_data.role
            target_user.is_active = role_data.is_active
            target_user.is_verified = role_data.is_verified
            await db.commit()

            return {"success": True, "message": "User updated successfully"}
        except Exception as e:
            print(f"update role error: {str(e)}")
            return {"success": False, "message": "Update role failed"}

    @staticmethod
    async def delete_user(db: AsyncSession, delete_data: DeleteUserSchema, current_user):
        try:
            user_id = current_user.get("sub")
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()

            if 'admin' not in user.role:
                return {"success": False, "message": "Only Admin can access this"}

            result = await db.execute(select(User).where(User.email == delete_data.email))
            target_user = result.scalars().first()

            if not target_user:
                return {"success": False, "message": "User not found"}

            await db.delete(target_user)
            await db.commit()

            return {"success": True, "message": "User deleted successfully"}
        except Exception as e:
            print(f"delete user error: {str(e)}")
            return {"success": False, "message": "Delete user failed"}

    @staticmethod
    async def request_password_reset_otp(db: AsyncSession, reset_data: ResetPasswordOTPSchema):
        try:
            result = await db.execute(select(User).where(User.email == reset_data.email))
            user = result.scalars().first()

            if not user:
                return {"success": False, "message": "User not found"}

            new_otp = str(random.randint(100000, 999999))
            user.otp = new_otp
            await db.commit()
            print("hii")
            await send_register_mail(user.email, new_otp, "Password Reset")

            return {"success": True, "message": "OTP sent to your email"}
        except Exception as e:
            print(f"reset password otp error: {str(e)}")
            return {"success": False, "message": "Internal Server Error"}

    @staticmethod
    async def reset_password(db: AsyncSession, reset_data: ResetPasswordSchema):
        try:
            result = await db.execute(select(User).where(User.email == reset_data.email))
            user = result.scalars().first()
            print("Stored OTP:", user.otp)
            print("Provided OTP:", reset_data.otp)

            if not user:
                return {"success": False, "message": "User not found"}

            if str(user.otp) != str(reset_data.otp):
                return {"success": False, "message": "Invalid OTP"}


            user.password_hash = hash_password(reset_data.new_password).decode('utf-8')
            await db.commit()

            return {"success": True, "message": "Password reset successfully"}
        except Exception as e:
            print(f"reset password error: {str(e)}")
            return {"success": False, "message": "Password reset failed"}
