# app/api/users_api.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.extensions import get_db
from app.schemas.user_schemas import UserCreateSchema, UserUpdateSchema
from app.services.user_service import UserService
from app.utils.response_handler import success_response, error_response

async def create_user_api(payload: UserCreateSchema, admin):
    async with get_db() as db:
        result = await UserService.create_user(db, payload, admin)
        if result["success"]:
            return success_response({"message": result["message"], "user": result.get("user")})
        else:
            return error_response(result["message"], status_code=400)

async def list_users_api():
    async with get_db() as db:
        result = await UserService.list_users(db)
        if result["success"]:
            return success_response({"users": result["users"]})
        else:
            return error_response(result["message"], status_code=400)

async def update_user_api(user_id: str, payload: UserUpdateSchema, admin):
    async with get_db() as db:
        result = await UserService.update_user(db, user_id, payload, admin)
        if result["success"]:
            return success_response({"message": result["message"], "user": result.get("user")})
        else:
            return error_response(result["message"], status_code=400)

async def delete_user_api(user_id: str, admin):
    async with get_db() as db:
        result = await UserService.delete_user(db, user_id, admin)
        if result["success"]:
            return success_response({"message": result["message"]})
        else:
            return error_response(result["message"], status_code=400)