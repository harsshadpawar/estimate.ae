from fastapi import APIRouter, Request, Depends
from app.decorators.rate_limit import dynamic_limiter
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.user_crud_service import register_user, verify_otp_service, forget_password_service, reset_password_service
from app.models.user_model import UserCreate, UserOut
from app.exceptions.custom_exceptions import AlreadyExistsException,NotFoundException
from app.main import logger
from app.utils.response import success_response,error_response
from app.models.opt_model import VerifyOtpRequest,VerifyOtpResponse, ResetPasswordRequest, ForgetPasswordRequest

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
            message="Unexpected error during registration.",
            debug=str(e),
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
            message="Unexpected error during OTP verification.",
            debug=str(e),
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
            message="Unexpected error during password reset request.",
            debug=str(e),
            status_code=500
        )
        
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
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
            message="Unexpected error during password reset.",
            debug=str(e),
            status_code=500
        )
