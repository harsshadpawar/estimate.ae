# app/middleware/cors.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

def add_cors_middleware(app: FastAPI):
    origins = [
        "http://localhost:3000",  # React frontend URL
        "https://your-production-frontend-domain.com",  # Your production frontend domain
        "http://localhost",       # Allow local access from localhost
        "http://127.0.0.1",       # Allow local access from 127.0.0.1
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # Allows CORS for these origins
        allow_credentials=True,
        allow_methods=["*"],    # Allows all HTTP methods (GET, POST, etc.)
        allow_headers=["*"],    # Allows all headers
    )

    # Add custom middleware to inspect response headers for CORS
    # @app.middleware("http")
    # async def add_cors_headers(request, call_next):
    #     response = await call_next(request)
    #     response.headers["Access-Control-Allow-Origin"] = "*"  # or specify your domain
    #     response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    #     response.headers["Access-Control-Allow-Headers"] = "*"
    #     return response
