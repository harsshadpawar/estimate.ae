from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY


# Base Custom Exception Class
class CustomException(Exception):
    def __init__(self, error_code: str, message: str = "An error occurred.", status_code: int = 400):
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


# Exception Handlers
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,  
        content={
            "error": exc.error_code,
            "message": exc.message
        }
    )


# Specific Exception Examples (with dynamic status code and messages)
class AlreadyExistsException(CustomException):
    def __init__(self, entity: str, message: str = None, status_code: int = 409):
        message = message or f"The {entity} is already exists."
        super().__init__(error_code="AlreadyExists", message=message, status_code=status_code)
        
class ApiRequestLimitExceededException(CustomException):
     def __init__(self, entity: str, message: str = None, status_code: int = 409):
        message = message or f"Api Limit exceeded for {entity}"
        super().__init__(error_code="APILimitExceed", message=message, status_code=status_code)
    

class NotFoundException(CustomException):
    def __init__(self, message: str = "The requested resource was not found.", status_code: int = 404):
        super().__init__(error_code="NotFound", message=message, status_code=status_code)


class BadRequestException(CustomException):
    def __init__(self, message: str = "Bad request.", status_code: int = 400):
        super().__init__(error_code="BadRequest", message=message, status_code=status_code)


class UnauthorizedException(CustomException):
    def __init__(self, message: str = "Unauthorized access.", status_code: int = 401):
        super().__init__(error_code="Unauthorized", message=message, status_code=status_code)


class ForbiddenException(CustomException):
    def __init__(self, message: str = "Forbidden.", status_code: int = 403):
        super().__init__(error_code="Forbidden", message=message, status_code=status_code)


class InternalServerErrorException(CustomException):
    def __init__(self, message: str = "Internal server error.", status_code: int = 500):
        super().__init__(error_code="InternalServerError", message=message, status_code=status_code)


async def validation_exception_handler(request: Request, exc: RequestValidationError):

    errors = [
        {
            "field": ".".join(str(loc) for loc in err["loc"][1:]),  # Skip 'body'
            "message": err["msg"]
        }
        for err in exc.errors()
    ]

    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation failed",
            "errors": errors
        },
    )