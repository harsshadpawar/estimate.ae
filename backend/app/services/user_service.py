# app/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user_schemas import UserCreateSchema, UserUpdateSchema
from app.utils.auth_utils import hash_password

class UserService:

    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreateSchema, current_user):
        try:
            # Verify if admin
            user_id = current_user.get("sub")
            admin_result = await db.execute(select(User).where(User.id == user_id))
            admin = admin_result.scalars().first()

            if 'admin' not in admin.role:
                return {"success": False, "message": "Only Admin can create users"}

            # Check if email already exists
            result = await db.execute(select(User).where(User.email == user_data.email))
            existing_user = result.scalars().first()

            if existing_user:
                return {"success": False, "message": "Email already in use"}

            # Create new user
            new_user = User(
                title=user_data.title,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                company_name=user_data.company_name,
                email=user_data.email,
                password_hash=hash_password(user_data.password).decode('utf-8'),
                role=user_data.role,
                is_active=user_data.is_active,
                is_verified=user_data.is_verified
            )

            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

            # Convert user object to dict for response
            user_dict = {
                "id": str(new_user.id),
                "email": new_user.email,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "role": new_user.role
            }

            return {"success": True, "message": "User created successfully", "user": user_dict}
        except Exception as e:
            print(f"create user error: {str(e)}")
            return {"success": False, "message": "Failed to create user"}

    @staticmethod
    async def list_users(db: AsyncSession):
        try:
            result = await db.execute(select(User))
            users = result.scalars().all()
            
            users_list = []
            for user in users:
                users_list.append({
                    "id": str(user.id),
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "company_name": user.company_name,
                    "role": user.role,
                    "is_active": user.is_active,
                    "is_verified": user.is_verified
                })
            
            return {"success": True, "users": users_list}
        except Exception as e:
            print(f"list users error: {str(e)}")
            return {"success": False, "message": "Failed to retrieve users"}

    @staticmethod
    async def update_user(db: AsyncSession, user_id: str, user_data: UserUpdateSchema, current_user):
        try:
            # Verify if admin
            admin_id = current_user.get("sub")
            admin_result = await db.execute(select(User).where(User.id == admin_id))
            admin = admin_result.scalars().first()

            if 'admin' not in admin.role:
                return {"success": False, "message": "Only Admin can update users"}

            # Find user to update
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()

            if not user:
                return {"success": False, "message": "User not found"}

            # Update user fields
            if user_data.title is not None:
                user.title = user_data.title
            if user_data.first_name is not None:
                user.first_name = user_data.first_name
            if user_data.last_name is not None:
                user.last_name = user_data.last_name
            if user_data.company_name is not None:
                user.company_name = user_data.company_name
            if user_data.email is not None:
                # Check if new email already exists
                if user_data.email != user.email:
                    email_check = await db.execute(select(User).where(User.email == user_data.email))
                    existing_email = email_check.scalars().first()
                    if existing_email:
                        return {"success": False, "message": "Email already in use"}
                user.email = user_data.email
            if user_data.password is not None:
                user.password_hash = hash_password(user_data.password).decode('utf-8')
            if user_data.role is not None:
                user.role = user_data.role
            if user_data.is_active is not None:
                user.is_active = user_data.is_active
            if user_data.is_verified is not None:
                user.is_verified = user_data.is_verified

            await db.commit()
            await db.refresh(user)

            # Convert user object to dict for response
            user_dict = {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }

            return {"success": True, "message": "User updated successfully", "user": user_dict}
        except Exception as e:
            print(f"update user error: {str(e)}")
            return {"success": False, "message": "Failed to update user"}

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: str, current_user):
        try:
            # Verify if admin
            admin_id = current_user.get("sub")
            admin_result = await db.execute(select(User).where(User.id == admin_id))
            admin = admin_result.scalars().first()

            if 'admin' not in admin.role:
                return {"success": False, "message": "Only Admin can delete users"}

            # Find user to delete
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()

            if not user:
                return {"success": False, "message": "User not found"}

            await db.delete(user)
            await db.commit()

            return {"success": True, "message": "User deleted successfully"}
        except Exception as e:
            print(f"delete user error: {str(e)}")
            return {"success": False, "message": "Failed to delete user"}