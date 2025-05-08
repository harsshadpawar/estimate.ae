
from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.models.auth_model  import LoginRequest, TokenResponse
from app.services.auth_service import authenticate_user, logout_user
from app.database.db import get_db
from app.main import logger
from app.utils.response import success_response,error_response
from fastapi.exceptions import RequestValidationError
from app.exceptions.custom_exceptions import CustomException
from app.utils.context_utils import set_trace_id
from app.utils.jwt_utils import get_token_from_header
from app.utils.role_checker import require_roles_from_token
router = APIRouter()

@router.post("/login")
async def login(request: Request, login_data: LoginRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Login attempt for: {login_data.email}")
        tokens = await authenticate_user(login_data,db)
        print("\n\n token",tokens)
        return success_response(message="Login successful", data=tokens)

    except CustomException as ce:
        logger.warning(f"Custom error: {ce.detail}")
        return error_response(message=str(e), status_code=ce.status_code)  

    except RequestValidationError as exc:
        logger.error(f"Validation error: {exc.errors()} | Body: {await request.body()}")
        return error_response(message=str(e), status_code=422)  

    except Exception as e:
        logger.exception("Unexpected error during login")
        return error_response(message=str(e), status_code=500) 
        

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(request: Request, db: AsyncSession = Depends(get_db)):
    print("Hello")
    try:
        token = get_token_from_header(request)
        logger.info(f"Logout initiated", extra={"path": str(request.url), "method": request.method})
        await logout_user(token, db)

        logger.info("Logout successful", extra={"path": str(request.url), "method": request.method})
        return success_response(message="Successfully logged out")

    except HTTPException as http_exc:
        logger.warning(f"Logout failed: {http_exc.detail}", extra={"path": str(request.url), "method": request.method})
        raise http_exc

    except Exception as e:
        logger.error(f"Unexpected logout error: {str(e)}", extra={"path": str(request.url), "method": request.method})
        return error_response(message="Logout failed due to server error", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@router.get("/admin")
async def admin_only(user=Depends(require_roles_from_token("admin"))):
    return {"message": "Welcome Admin"}    

@router.get("/user")
async def user_only(user=Depends(require_roles_from_token("user"))):
    logger.info(f"User API Call initiated")
    return {"message": "Welcome User"}    