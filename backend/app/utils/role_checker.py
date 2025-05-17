# app/dependencies/role_checker.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt_utils import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login")

def require_roles_from_token(*roles: str):
    def checker(token: str = Depends(oauth2_scheme)):
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

       
        user_role = payload.get("role")
        # print("user_role",user_role)
        if user_role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        return payload  # or user_id, etc., if needed
    return checker
