from fastapi import APIRouter, Depends
from app.api.users_api import (
    create_user_api, list_users_api,
    update_user_api, delete_user_api
)
from app.schemas.user_schemas import UserCreateSchema, UserUpdateSchema
from app.utils.jwt import get_current_admin_user

router = APIRouter(tags=["User"])

@router.post("/create-user")
async def create_user_route(payload: UserCreateSchema, admin=Depends(get_current_admin_user)):
    return await create_user_api(payload, admin)

@router.get("/list-users")
async def list_users_route( admin=Depends(get_current_admin_user)):
    return await list_users_api()

@router.put("/update-user/{user_id}")
async def update_user_route(user_id: str, payload: UserUpdateSchema, admin=Depends(get_current_admin_user)):
    return await update_user_api(user_id, payload, admin)

@router.delete("/delete-user/{user_id}")
async def delete_user_route(user_id: str, admin=Depends(get_current_admin_user)):
    return await delete_user_api(user_id, admin)
