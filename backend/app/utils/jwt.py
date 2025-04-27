from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from sqlalchemy.future import select
from app.models.user import User
from app.config.extensions import get_db

# Secret key and settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# For token auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthJWT:
    @staticmethod
    def create_access_token(identity: dict, expires_delta: timedelta = None):
        to_encode = identity.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decode_token(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def create_refresh_token(identity: dict, expires_delta: timedelta = None):
        to_encode = identity.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(days=30))  # Default refresh token expiry of 30 days
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = AuthJWT.decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return payload  # Or return a user object from DB

async def get_current_admin_user(current_user=Depends(get_current_user)):
    async with get_db() as db:
        result = await db.execute(select(User).where(User.id == current_user.get("sub")))
        user = result.scalars().first()
        
        if not user or 'admin' not in user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
        return current_user