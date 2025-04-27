# # app/api/auth_api.py
# import random
# import bcrypt
# from fastapi import HTTPException, status
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from app.config.extensions import get_db
# from app.models.user import User
# from app.schemas.auth_schemas import (
#     RegisterSchema,
#     LoginSchema,
#     VerifyOTPSchema,
#     UpdateRoleSchema,
#     DeleteUserSchema,
#     ResetPasswordOTPSchema,
#     ResetPasswordSchema
# )
# from app.utils.jwt import AuthJWT
# from app.utils.auth_utils import hash_password
# from app.utils.email_utils import send_register_mail
# from sqlalchemy.orm import selectinload
# from app.utils.response_handler import success_response, error_response, unauthorized_response,forbidden_response,not_found_response


# # JWT Blacklist to manage invalidated tokens
# BLACKLIST = set()

# async def register_user(user_data: RegisterSchema):
#     """Register a new user and send OTP for verification"""
#     async with get_db() as db:
#         # Check if the user already exists
#         result = await db.execute(select(User).where(User.email == user_data.email))
#         existing_user = result.scalars().first()
        
#         if existing_user:
#             return error_response("Email already in use",
#                 status_code=400,
#             )

#         # Create the new user instance
#         new_user = User(
#             title=user_data.title,
#             first_name=user_data.first_name,
#             last_name=user_data.last_name,
#             company_name=user_data.company_name,
#             email=user_data.email,
#             password_hash=hash_password(user_data.password).decode('utf-8')
#         )

#         # Generate OTP and set it for the user
#         otp_code = str(random.randint(100000, 999999))
#         new_user.otp = otp_code

#         # Add the new user to the database
#         db.add(new_user)
#         await db.commit()

#         # Send the OTP to the user's email
#         try:
#             await send_register_mail(new_user.email, otp_code, "Registration")
#             return success_response({"message": "OTP sent to your email! Please check your email"})
#         except Exception as e:
#             # Log the error
#             print(f"Failed to send email: {e}")
#             return error_response("Failed to send OTP email", status_code=400)

# async def login_user(login_data: LoginSchema):
#     """Authenticate and login a user"""
#     async with get_db() as db:
#         # Find the user by email
#         result = await db.execute(select(User).where(User.email == login_data.email))
#         user = result.scalars().first()

#         if not user:
#             return unauthorized_response("Invalid email or password")

#         try:
#             # Check if the password matches the stored hash
#             if bcrypt.checkpw(login_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
#                 access_token = AuthJWT.create_access_token(identity={"sub": str(user.id)})
#                 refresh_token = AuthJWT.create_refresh_token(identity={"sub": str(user.id)})

#                 return success_response({
#                     "access_token": access_token,
#                     "refresh_token": refresh_token,
#                     "user_role": user.role
#                 })
#         except ValueError as e:
#             print(f"Error with password hash: {e}")
#             return unauthorized_response("Invalid email or password")

#         return unauthorized_response("Invalid email or password")


# async def logout_user(current_user):
#     """Logout the user and invalidate their JWT"""
#     jti = current_user.get("jti")  # JWT ID
#     BLACKLIST.add(jti)  # Add the token to the blacklist
#     return {"message": "Logout successful."}

# async def verify_otp(otp_data: VerifyOTPSchema):
#     """Verify OTP for user registration"""
#     async with get_db() as db:
#         try:
#             # Find the user by email
#             result = await db.execute(select(User).where(User.email == otp_data.email))
#             user = result.scalars().first()
            
#             if not user:
#                 return unauthorized_response("User not found")
            
#             if user.otp != otp_data.otp:
#                 return error_response("Invalid OTP", status_code=400)


#             # Activate and verify user
#             user.is_verified = True
#             user.is_active = True
#             await db.commit()
            
#             return success_response({"message": "OTP verified successfully"})
            
#         except Exception as e:
#             # Log the error
#             print(f"verify otp error: {str(e)}")
#             return error_response("OTP verification failed",
#                 status_code=400,
#             )

# async def update_user_role(role_data: UpdateRoleSchema, current_user):
#     """Update user role (admin only)"""
#     async with get_db() as db:
#         try:
#             # Get the current user from db
#             user_id = current_user.get("sub")
#             result = await db.execute(select(User).where(User.id == user_id))
#             user = result.scalars().first()
            
#             # Check if user is admin
#             if 'admin' not in user.role:
#                 return forbidden_response({"message":"Only Admin can access this"})
            
#             # Find the user to update
#             result = await db.execute(select(User).where(User.email == role_data.email))
#             target_user = result.scalars().first()
            
#             if not target_user:
#                 return not_found_response({"message":"User not found"})
            
#             # Update user role and status
#             target_user.role = role_data.role
#             target_user.is_active = role_data.is_active
#             target_user.is_verified = role_data.is_verified
#             await db.commit()
            
#             return success_response({"message": "User updated successfully"})
            
#         except Exception as e:
#             # Log the error
#             print(f"update role error: {str(e)}")
#             return error_response("Update role failed",
#                 status_code=400,
#             )

# async def delete_user(delete_data: DeleteUserSchema, current_user):
#     """Delete a user (admin only)"""
#     async with get_db() as db:
#         try:
#             # Get the current user from db
#             user_id = current_user.get("sub")
#             result = await db.execute(select(User).where(User.id == user_id))
#             user = result.scalars().first()
            
#             # Check if user is admin
#             if 'admin' not in user.role:
#                 return forbidden_response({"message":"Only Admin can access this"})
            
#             # Find the user to delete
#             result = await db.execute(select(User).where(User.email == delete_data.email))
#             target_user = result.scalars().first()
            
#             if not target_user:
#                 return not_found_response({"message":"User not found"})
            
#             # Delete the user
#             await db.delete(target_user)
#             await db.commit()
            
#             return success_response({"message": "User deleted successfully"})
            
#         except Exception as e:
#             # Log the error
#             print(f"delete user error: {str(e)}")
#             return error_response("Delete user failed",
#                 status_code=400,
#             )

# async def request_password_reset_otp(reset_data: ResetPasswordOTPSchema):
#     """Request an OTP for password reset"""
#     async with get_db() as db:
#         try:
#             # Find the user by email
#             result = await db.execute(select(User).where(User.email == reset_data.email))
#             user = result.scalars().first()
            
#             if not user:
#                 return not_found_response({"message":"User not found"})
            
#             # Generate a new OTP
#             new_otp = str(random.randint(100000, 999999))
            
#             # Update the OTP for the user
#             user.otp = new_otp
#             await db.commit()
            
#             # Send the OTP to the user's email
#             await send_register_mail(user.email, new_otp, "Password Reset")
            
#             return success_response({"message": "OTP sent to your email"})
            
#         except Exception as e:
#             # Log the error
#             print(f"reset password otp error: {str(e)}")
#             return error_response("Internal Server Error",
#                 status_code=400,
#             )

# async def reset_password(reset_data: ResetPasswordSchema):
#     """Reset user password using OTP"""
#     async with get_db() as db:
#         try:
#             # Find the user by email
#             result = await db.execute(select(User).where(User.email == reset_data.email))
#             user = result.scalars().first()
            
#             if not user:
#                 return not_found_response({"message":"User not found"})
            
#             # Check if OTP matches
#             if user.otp != reset_data.otp:
#                 return error_response("Invalid OTP",
#                     status_code=400,
#                 )
            
#             # Update the user's password
#             user.password_hash = hash_password(reset_data.new_password).decode('utf-8')
#             await db.commit()
            
#             return success_response({"message": "Password reset successfully"})
            
#         except Exception as e:
#             # Log the error
#             print(f"reset password error: {str(e)}")
#             return error_response("Password reset failed",
#                 status_code=400,
#             )

# app/api/auth_api.py

from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.extensions import get_db
from app.schemas.auth_schemas import (
    RegisterSchema,
    LoginSchema,
    VerifyOTPSchema,
    UpdateRoleSchema,
    DeleteUserSchema,
    ResetPasswordOTPSchema,
    ResetPasswordSchema
)
from app.services.auth_service import AuthService
from app.utils.response_handler import success_response, error_response

async def register_user(user_data: RegisterSchema ):
    async with get_db() as db:
        result = await AuthService.register_user(db, user_data)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def login_user(login_data: LoginSchema):
    async with get_db() as db:
        result = await AuthService.login_user(db,login_data)
        if result["success"]:
            return success_response(result)
        else:
            return error_response(result["message"], status_code=401)

async def logout_user(current_user):
    async with get_db() as db:
        result = await AuthService.logout_user(current_user)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def verify_otp(otp_data: VerifyOTPSchema):
    async with get_db() as db:
        result = await AuthService.verify_otp(db,otp_data)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def update_user_role(role_data: UpdateRoleSchema, current_user):
    async with get_db() as db:
        result = await AuthService.update_user_role(db,role_data, current_user)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def delete_user(delete_data: DeleteUserSchema, current_user):
    async with get_db() as db:
        result = await AuthService.delete_user(db,delete_data, current_user)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def request_password_reset_otp(reset_data: ResetPasswordOTPSchema):
    async with get_db() as db:
        result = await AuthService.request_password_reset_otp(db,reset_data)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)

async def reset_password(reset_data: ResetPasswordSchema):
    async with get_db() as db:
        result = await AuthService.reset_password(db,reset_data)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)
