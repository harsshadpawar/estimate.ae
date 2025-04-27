# app/schemas/user_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreateSchema(BaseModel):
    title: str
    first_name: str
    last_name: str
    company_name: str
    email: EmailStr
    password: str
    role: str = "user"
    is_active: bool = False
    is_verified: bool = False

class UserUpdateSchema(BaseModel):
    title: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None