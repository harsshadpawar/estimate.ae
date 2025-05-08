from functools import wraps
from fastapi import Request
from app.main import limiter, ROLE_LIMITS
from slowapi.util import get_remote_address

def get_user_role_key(request: Request) -> str:
    try:
        user = decode_jwt(request)
        return user.get("sub", "anonymous")
    except Exception:
        return get_remote_address(request)

def dynamic_limiter():
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            user = decode_jwt(request)
            print("user",user)
            role = user.get("role", "free")
            print("role",role)
            if role == "admin":
                return await func(request, *args, **kwargs)

            limit = ROLE_LIMITS.get(role, "5/minute")

            # Wrap original function with limiter here
            rate_limited_func = limiter.limit(limit, key_func=get_user_role_key)(func)
            return await rate_limited_func(request, *args, **kwargs)

        return wrapper
    return decorator
