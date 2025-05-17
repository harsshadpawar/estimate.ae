from fastapi import FastAPI, Request
from app.config.settings import get_settings
import importlib
import os
import importlib
from pathlib import Path
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from app.database.db import get_db
from app.database.init_db import init_db
# from app.services.log_service import save_log
from app.utils.log_elasticsearch import setup_logger
import uuid
from app.database.init_db import seed_roles, seed_subscription_plans,seed_plan_limits, seed_products, seed_countries, seed_country_subscription_plans
from app.middleware.cors import add_cors_middleware
from app.middleware.log_requests import TraceIDMiddleware, APIKeyMiddleware
from app.middleware.token_request import CheckBlacklistMiddleware
from app.exceptions.custom_exceptions import (
    AlreadyExistsException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    InternalServerErrorException,
    custom_exception_handler,
    ApiRequestLimitExceededException
)

from fastapi.exceptions import RequestValidationError
from app.exceptions.custom_exceptions import validation_exception_handler
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()
logger = setup_logger()
app = FastAPI(title=settings.APP_NAME)

# middlewares
app.add_middleware(APIKeyMiddleware)
app.add_middleware(TraceIDMiddleware)
app.add_middleware(CheckBlacklistMiddleware)

add_cors_middleware(app)

limiter = Limiter(key_func=get_remote_address) 
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."}
    )



@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    logger.info(f"{settings.APP_NAME} started")
    logger.info(f"🚀Environment: {settings.environment}")
    # logger.info(f"🚧Intialize DB: {settings.DATABASE_URL}")
    init_db()
    seed_countries(db)
    seed_products(db)
    seed_roles(db)
    seed_subscription_plans(db)
    seed_plan_limits(db)
    seed_country_subscription_plans(db)
    

def register_versioned_routers():
    base_path = Path("app/controllers")
    
    for version_dir in base_path.iterdir():
        if version_dir.is_dir():
            version = version_dir.name
            for controller_file in version_dir.glob("*_controller.py"):
                module_name = controller_file.stem
                try:
                    # Dynamic import
                    router_module = importlib.import_module(f"app.controllers.{version}.{module_name}")
                    router = getattr(router_module, "router", None)
                    if router:
                        prefix = f"/{version}/{module_name.replace('_controller', '')}"
                        app.include_router(router, prefix=prefix, tags=[f"{version} {module_name}"])
                        print(f"✅ Registered: {prefix}")
                except Exception as e:
                    print(f"❌ Error loading {version}/{module_name}: {e}")



register_versioned_routers()

@app.get("/")
def read_root():
    db = next(get_db())
    return {
        "message": f"Welcome to {settings.APP_NAME}, datbase {settings.DATABASE_URL}",
        "env": settings.environment,
        "debug": settings.debug
    }



# Register the global exception handler
app.add_exception_handler(AlreadyExistsException, custom_exception_handler)
app.add_exception_handler(NotFoundException, custom_exception_handler)
app.add_exception_handler(BadRequestException, custom_exception_handler)
app.add_exception_handler(UnauthorizedException, custom_exception_handler)
app.add_exception_handler(ForbiddenException, custom_exception_handler)
app.add_exception_handler(InternalServerErrorException, custom_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(ApiRequestLimitExceededException, custom_exception_handler)