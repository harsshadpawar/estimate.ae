from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from jose import JWTError, jwt
from app.models.user_model import TokenBlacklist 
# from app.database.db import
from sqlalchemy.orm import Session
from sqlalchemy import select
from starlette import status
from app.database.db import SessionLocal  
from app.constants.constants import PUBLIC_ENDPOINTS

class CheckBlacklistMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # print("request token",request,"path",request.url.path) 
        if any(request.url.path.endswith(endpoint) for endpoint in PUBLIC_ENDPOINTS):
            return await call_next(request)
        
        token = None
        auth_header = request.headers.get("Authorization")

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
                
        if not token:
            return JSONResponse(status_code=401, content={"detail": "Authorization token missing"})  
        
        try:
            db: Session = SessionLocal()
            existing_token = db.execute(select(TokenBlacklist).where(TokenBlacklist.token == token)).scalar_one_or_none()
        finally:
            db.close()

        if existing_token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Token has been revoked"}
            )
        
        return await call_next(request)