from fastapi.responses import JSONResponse
from typing import Any, Optional, Dict
import logging

logger = logging.getLogger(__name__)

def success_response( data: Any = None,message: str = "Success", status_code: int = 200,meta: Optional[Dict[str, Any]] = None):
    """
    Generic success response wrapper with optional metadata.
    """
    response_content = {
        "success": True,
        "message": message,
        "data": data,
    }
    if meta:
        response_content["meta"] = meta

    return JSONResponse(
        status_code=status_code,
        content=response_content
    )


def error_response(
    message: str = "An error occurred",status_code: int = 500,data: Optional[Any] = None, debug: Optional[str] = None):
    """
    Generic error response wrapper with optional debug message.
    """
    logger.warning(f"Error Response: {message} | Debug: {debug}")

    response_content = {
        "success": False,
        "message": message,
        "data": data
    }

    if debug:
        response_content["debug"] = debug  # Only show in dev

    return JSONResponse(
        status_code=status_code,
        content=response_content
    )
