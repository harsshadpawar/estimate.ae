from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user_model import User, TokenBlacklist
from app.utils.hashing import verify_password  # Assuming you use a password hashing utility
from app.models.auth_model import LoginRequest
from app.utils.jwt_utils import create_access_token, create_refresh_token, decode_token
from app.utils.context_utils import get_trace_id
from app.main import logger

async def authenticate_user(login_data: LoginRequest, db: AsyncSession) -> User:
    query =  select(User).where(User.email == login_data.email)
    result =  db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Account not found."
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive. Please contact support."
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email to continue."
     )    
     
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
    )    
        
    # Create access and refresh tokens
    role = user.role.name if user.role else "user"
    subscription = user.subscription_plan.name if user.subscription_plan else "free"   
    user_name = user.first_name
    company_id = user.company_id
    
    access_token = create_access_token(user.id,user_name,company_id, role, subscription)
    refresh_token = create_refresh_token(user.id)
    

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 900  # 15 minutes for the access token (adjust as needed)
    }


async def logout_user(token: str, db: AsyncSession):
    try:
        # Decode token to validate structure and extract user info
        payload = decode_token(token)
        print("payload",payload)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        # Optional: prevent duplicate entry
        existing_token =  db.execute(select(TokenBlacklist).where(TokenBlacklist.token == token))
        if existing_token.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token already blacklisted")

        # Store token in blacklist
        token_entry = TokenBlacklist(token=token)
        db.add(token_entry)
        db.commit()

        logger.info(f"User {payload.get('sub')} logged out successfully")

    except HTTPException:
        raise  # Re-raise known errors
    except Exception as e:
        logger.error(f"Logout failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Logout failed due to a server error") from e

