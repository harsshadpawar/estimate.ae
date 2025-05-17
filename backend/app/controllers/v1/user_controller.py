from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.user_crud_service import (
    register_user,
    verify_otp_service,
    forget_password_service,
    reset_password_service,
    get_all_users,
    get_all_users_detailed_sql,
    update_user,
    get_user_id,
    delete_user_by_id,
    assign_role_to_user
)

from app.models.user_model import UserCreate, UserOut, UserAllOut, UserUpdate, RoleAssign
from app.exceptions.custom_exceptions import AlreadyExistsException,NotFoundException
from app.main import logger
from app.utils.response import success_response,error_response
from app.models.opt_model import VerifyOtpRequest,VerifyOtpResponse, ResetPasswordRequest, ForgetPasswordRequest
from fastapi.encoders import jsonable_encoder
from app.utils.role_checker import require_roles_from_token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created_user = register_user(user, db)
        logger.info(f"User registered: {created_user.email}")
        return success_response(
            data=UserOut.from_orm(created_user).dict(),
            message="User registered successfully.",
            status_code=201
        )
    except AlreadyExistsException as e:
        
        logger.error(f"Registration failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=400)  # 400 for bad request (email exists)
    except NotFoundException as e:
        logger.error(f"Registration failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)  # 404 for not found (role missing)
    except Exception as e:
        logger.error("Unexpected error during registration", exc_info=True)
        return error_response(
            message=str(e),
            status_code=500
        )

@router.post("/verify-otp", response_model=VerifyOtpResponse)
def verify_otp(data: VerifyOtpRequest, db: Session = Depends(get_db)):
    try:
        result = verify_otp_service(data, db)
        logger.info(f"OTP verified for {data.email}")
        return success_response(
            data=result,
            message="OTP verified successfully.",
            status_code=200
        )
    except NotFoundException as e:
        logger.error(f"OTP verification failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)
    except Exception as e:
        logger.error("Unexpected error during OTP verification", exc_info=True)
        return error_response(
            message=str(e),
            status_code=500
        )


@router.post("/forget-password")
def forget_password_request(data: ForgetPasswordRequest, db: Session = Depends(get_db)):
    try:
        result = forget_password_service(data, db)
        logger.info(f"Password reset OTP sent to {data.email}")
        return success_response(
            data=result,
            message="Password reset OTP sent successfully.",
            status_code=200
        )
    except NotFoundException as e:
        logger.error(f"Password reset failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)
    except Exception as e:
        logger.error("Unexpected error during password reset request", exc_info=True)
        return error_response(
            message=str(e),
            status_code=500
        )
        
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        print("reset data",data)
        reset_password_service(data, db)
        logger.info(f"Password reset successful for {data.email}")
        return success_response(
            message="Password reset successfully.",
            status_code=200
        )
    except NotFoundException as e:
        logger.error(f"Reset failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)
    except ValueError as e:
        logger.warning(f"Invalid OTP for {data.email}")
        return error_response(message=str(e), status_code=400)
    except Exception as e:
        logger.error("Unexpected error during password reset", exc_info=True)
        return error_response(
            message=str(e),
            status_code=500
        )


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    try:
        users = get_all_users_detailed_sql(db)
        logger.info("Fetched all users")
        return success_response(
             data=jsonable_encoder([UserAllOut.from_orm(user) for user in users]),
            message="Users fetched successfully",
            status_code=200
        )
    except Exception as e:
        logger.error("Error fetching users", exc_info=True)
        return error_response(
            message="Internal server error",
            status_code=500
        )

@router.get("/{user_id}")
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    try:
        user = get_user_id(db, user_id)
        if not user:
            return error_response(
                message="User not found",
                status_code=404
            )
        logger.info(f"Fetched user by id: {user_id}")
        return success_response(
            data=jsonable_encoder(UserAllOut.from_orm(user)),
            message="User fetched successfully",
            status_code=200
        )
    except Exception as e:
        logger.error(f"Error fetching user with ID {user_id}", exc_info=True)
        return error_response(
            message="Internal server error",
            status_code=500
        )


@router.put("/{user_id}")
def update_user_handler(user_id: str, payload: UserUpdate, db: Session = Depends(get_db)):
    try:
        updated_user = update_user(user_id=user_id, payload=payload, db=db)
        if not updated_user:
            logger.warning(f"User with ID {user_id} not found")
            return error_response(message="User not found", status_code=404)

        logger.info(f"User with ID {user_id} updated successfully")
        return success_response(
            data=jsonable_encoder(UserOut.from_orm(updated_user)),
            message="User updated successfully",
            status_code=200
        )
    except Exception as e:
        logger.error(f"Error updating user {user_id}", exc_info=True)
        return error_response(
            message="Internal server error",
            status_code=500
        )
        
@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    try:
        deleted = delete_user_by_id(db, user_id)
        if not deleted:
            return error_response(
                message="User not found or already deleted",
                status_code=404
            )
        logger.info(f"Soft-deleted user with id: {user_id}")
        return success_response(
            message="User deleted successfully",
            status_code=200
        )
    except Exception as e:
        logger.error(f"Error deleting user with ID {user_id}", exc_info=True)
        return error_response(
            message="Internal server error",
            status_code=500
        )
        
@router.put("/{user_id}/assign-role")
def assign_role_handler(user_id: str, payload: RoleAssign, db: Session = Depends(get_db),user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        user = assign_role_to_user(user_id=user_id, role_name=payload.role_name, db=db)

        if not user:
            logger.warning(f"User with ID {user_id} not found")
            return error_response(message="User not found", status_code=404)

        logger.info(f"Assigned role {payload.role_name} to user {user_id}")
        return success_response(
            data=jsonable_encoder(UserOut.from_orm(user)),
            message="Role assigned successfully",
            status_code=200
        )
    except ValueError as ve:
        logger.warning(f"Invalid role name: {payload.role_name}")
        return error_response(message=str(ve), status_code=400)
    except Exception as e:
        logger.error(f"Error assigning role to user {user_id}", exc_info=True)
        return error_response(
            message="Internal server error",
            status_code=500
        )        