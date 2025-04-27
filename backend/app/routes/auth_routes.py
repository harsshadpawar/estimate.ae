# app/routes/auth_routes.py
from fastapi import APIRouter, Depends
from app.api.auth_api import (
    register_user,
    login_user,
    logout_user,
    verify_otp,
    update_user_role,
    delete_user,
    request_password_reset_otp,
    reset_password
)
from app.schemas.auth_schemas import (
    RegisterSchema,
    LoginSchema,
    VerifyOTPSchema,
    UpdateRoleSchema,
    DeleteUserSchema,
    ResetPasswordOTPSchema,
    ResetPasswordSchema
)
from app.utils.jwt import get_current_user

router = APIRouter(tags=["Authentication"])

# Register endpoint
@router.post("/register", status_code=201)
async def register(user_data: RegisterSchema):
    """Register a new user"""
    return await register_user(user_data)

# Login endpoint
@router.post("/login")
async def login(login_data: LoginSchema):
    """Authenticate and login a user"""
    return await login_user(login_data)

# Logout endpoint
@router.post("/logout")
async def logout(current_user=Depends(get_current_user)):
    """Logout the user and invalidate their JWT"""
    return await logout_user(current_user)

# Verify OTP endpoint
@router.post("/verify-otp")
async def verify(otp_data: VerifyOTPSchema):
    """Verify OTP for user registration"""
    return await verify_otp(otp_data)

# Update user role endpoint
@router.post("/update-role")
async def update_role(role_data: UpdateRoleSchema, current_user=Depends(get_current_user)):
    """Update user role (admin only)"""
    return await update_user_role(role_data, current_user)

# Delete user endpoint
@router.post("/delete")
async def delete(delete_data: DeleteUserSchema, current_user=Depends(get_current_user)):
    """Delete a user (admin only)"""
    return await delete_user(delete_data, current_user)

# Request password reset OTP endpoint
@router.post("/reset-password/otp")
async def request_password_otp(reset_data: ResetPasswordOTPSchema):
    """Request an OTP for password reset"""
    return await request_password_reset_otp(reset_data)

# Reset password endpoint
@router.post("/reset-password")
async def reset_user_password(reset_data: ResetPasswordSchema):
    """Reset user password using OTP"""
    return await reset_password(reset_data)