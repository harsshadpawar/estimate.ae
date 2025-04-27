from fastapi import APIRouter

from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router

def include_all_routers():
    router = APIRouter()
    
    router.include_router(auth_router, prefix="/api/auth")
    router.include_router(user_router, prefix="/api/user")

    return router
