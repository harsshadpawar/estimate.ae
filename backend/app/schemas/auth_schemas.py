# app/schemas/auth_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterSchema(BaseModel):
    title: Optional[str] = None
    first_name: str
    last_name: str
    company_name: Optional[str] = None
    email: EmailStr
    password: str = Field(..., min_length=8)

    class Config:
        schema_extra = {
            "example": {
                "title": "Mr",
                "first_name": "John",
                "last_name": "Doe",
                "company_name": "Acme Inc",
                "email": "john.doe@example.com",
                "password": "securepassword123"
            }
        }

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "password": "securepassword123"
            }
        }

class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "otp": "123456"
            }
        }

class UpdateRoleSchema(BaseModel):
    email: EmailStr
    role: str
    is_active: bool
    is_verified: bool

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "role": "admin",
                "is_active": True,
                "is_verified": True
            }
        }

class DeleteUserSchema(BaseModel):
    email: EmailStr

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com"
            }
        }

class ResetPasswordOTPSchema(BaseModel):
    email: EmailStr

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com"
            }
        }

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=8)

    class Config:
        schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "otp": "123456",
                "new_password": "newsecurepassword123"
            }
        }