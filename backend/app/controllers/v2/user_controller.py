from fastapi import APIRouter
from app.schemas.user_schema import UserCreate, UserResponse

router = APIRouter()

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    return {"id": "v2-id", "name": user.name, "email": user.email}
