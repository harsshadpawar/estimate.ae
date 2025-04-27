# main.py
import os
import asyncio
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.config import config_by_name
from app.config.extensions import init_db
from app.utils.jwt import get_current_user, AuthJWT
from app.routes import include_all_routers
from fastapi.exceptions import RequestValidationError
from app.utils.response_handler import validation_exception_handler
load_dotenv()

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_application():
    config_name = os.getenv("FLASK_ENV", "default")
    app_config = config_by_name[config_name]
    app = FastAPI(
        title="Estimate App API Swagger",
        description="Documentation of all estimate app API endpoints",
        version="1.0"
    )
    app.add_exception_handler(RequestValidationError, validation_exception_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(include_all_routers())

    @app.get("/")
    async def index():
        return {"message": "Welcome to Estimate App API with Swagger!"}

    @app.get("/test-freecad")
    async def test_freecad():
        try:
            import FreeCAD
            return {"message": "FreeCAD is integrated!"}
        except ImportError:
            return {"message": "FreeCAD is not installed."}

    @app.post("/auth/token/refresh/")
    async def refresh_token(user=Depends(get_current_user)):
        new_token = AuthJWT.create_access_token(identity=user)
        return {"access_token": new_token}


    @app.get("/uploads/{foldername}/{filename}")
    async def serve_file(foldername: str, filename: str):
        path = os.path.join(UPLOAD_FOLDER, foldername.lower(), filename)
        if not os.path.exists(path):
            raise HTTPException(status_code=404, detail="File not found")
        return FileResponse(path)

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(status_code=404, content={"error": "Resource not found"})

    @app.exception_handler(500)
    async def internal_error_handler(request: Request, exc):
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

    # Initialize DB asynchronously
    @app.on_event("startup")
    async def startup_event():
        await init_db(app, app_config)

    return app

# Expose FastAPI app instance
app = get_application()
