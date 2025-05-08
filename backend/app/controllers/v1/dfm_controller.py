from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.api_usage_model import ApiUsageCreate, ApiUsageResponse
from app.services.api_usage_service import log_api_usage, get_all_logs, fetch_users_exceeding_daily_limit
from app.main import logger
from typing import List
from app.utils.response import success_response, error_response
from app.utils.role_checker import require_roles_from_token
from sqlalchemy import text
from datetime import date, datetime
from decimal import Decimal
from functools import wraps
from app.exceptions.custom_exceptions import ApiRequestLimitExceededException

router = APIRouter()


def check_daily_limit():
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, db: Session = Depends(get_db), *args, **kwargs):
            # request: Request = kwargs.get("request")
            # db: Session = kwargs.get("db")
            try:
                body = await request.json()  # This is a coroutine, so we need to await it.
                user_id = body.get("user_id")
                company_id = body.get("company_id")
                # body = await request.json()
                # user_id = body.get("user_id")
                # company_id = body.get("company_id")
                print("user_id",user_id)
                user_fetch_resp =  fetch_users_exceeding_daily_limit(db,user_id)
                print("user_fetch_resp",user_fetch_resp)
                 # Create the response data
                response_data = [{
                    "usage_count": row[0],
                    "start_date": row[1],
                    "end_date": row[2],
                    "plan_name": row[3],
                    "price": row[4],
                    "period": row[5],
                    "api_name": row[6],
                    "limit_count": row[7]
                } for row in user_fetch_resp]
                print("response_data",response_data)
                
                 # Check if any usage count exceeds limit
                for data in response_data:
                     if data["usage_count"] > data["limit_count"]:
                        print("raise usage")
                        raise ApiRequestLimitExceededException(f'{data["period"]} with {data["plan_name"]} plan. Please contact Adminstrator')
            except Exception as e:
                raise e
    
            return  func(request, *args, db=db, **kwargs)
        return wrapper
    return decorator


@router.post("/analysis/")
@check_daily_limit()
def get_usage_count_exceeded(
    request: Request,
    usage_data: ApiUsageCreate,
    db: Session = Depends(get_db)
):
    try:
        new_log = log_api_usage(db, usage_data)
        print("new_log",new_log)
        logger.info("Fetched exceeded usage counts.")
        return success_response(
            data=[],
            message="Run DFM Analysis API ",
            status_code=200
        )
    except Exception as e:
        logger.error("Error fetching exceeded usage data", exc_info=True)
        return error_response(
            message="Error fetching exceeded usage data.",
            debug=str(e),
            status_code=500
        )








def serialize_row(row):
    return {
        key: (
            value.isoformat() if isinstance(value, (date, datetime))
            else float(value) if isinstance(value, Decimal)
            else value
        )
        for key, value in row._mapping.items()
    }
