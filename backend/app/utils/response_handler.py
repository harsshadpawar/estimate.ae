# app/utils/response_handler.py
from fastapi.responses import JSONResponse
from fastapi import status, Request
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from datetime import datetime
from typing import Any, List, Dict, Union

def success_response(data: Any, status_code: int = status.HTTP_200_OK) -> JSONResponse:
    """
    Returns a success response with a consistent structure.
    """
    response_data = {
        "status": "success",
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status_code)

def error_response(message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> JSONResponse:
    """
    Returns an error response with a consistent structure.
    """
    response_data = {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status_code)

def validation_error_response(errors: List[Dict], status_code: int = status.HTTP_422_UNPROCESSABLE_ENTITY) -> JSONResponse:
    """
    Returns a validation error response with a consistent structure.
    """
    response_data = {
        "status": "error",
        "errors": errors,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status_code)

def unauthorized_response(message: str = "Unauthorized access") -> JSONResponse:
    """
    Returns an unauthorized response with a consistent structure.
    """
    response_data = {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status.HTTP_401_UNAUTHORIZED)

def forbidden_response(message: str = "Forbidden access") -> JSONResponse:
    """
    Returns a forbidden response with a consistent structure.
    """
    response_data = {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status.HTTP_403_FORBIDDEN)

def not_found_response(message: str = "Resource not found") -> JSONResponse:
    """
    Returns a not found response with a consistent structure.
    """
    response_data = {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(content=response_data, status_code=status.HTTP_404_NOT_FOUND)

# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     """
#     Custom handler for request validation errors to match our response format
#     """
#     errors = []
#     for error in exc.errors():
#         # Extract error details
#         error_type = error.get("type", "validation_error")
#         location = error.get("loc", [])
#         location_str = " → ".join(str(loc) for loc in location if loc != "body")
#         message = error.get("msg", "Validation error")
#         input_value = error.get("input", None)
#         context = error.get("ctx", {})
        
#         # Create standardized error object
#         error_obj = {
#             "field": location_str if location_str else None,
#             "message": message,
#             "value": input_value
#         }
        
#         # Add any additional context if available
#         if context:
#             error_obj["context"] = context
            
#         errors.append(error_obj)
    
#     # Return our custom formatted error response
#     return validation_error_response(errors)

def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for request validation errors to match our response format (dict style).
    """
    errors = {}

    for error in exc.errors():
        location = error.get("loc", [])
        field = location[-1] if location else "unknown"
        message = error.get("msg", "Validation error")
        input_value = error.get("input", None)
        context = error.get("ctx", {})

        error_detail = {
            "message": message,
            "value": input_value
        }

        if context:
            error_detail["context"] = context

        errors[field] = error_detail

    return validation_error_response(errors)
