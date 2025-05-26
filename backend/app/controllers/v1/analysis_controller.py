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
from app.utils.jwt_utils import decode_token
from app.utils.rate_limiter import check_daily_limit

router = APIRouter()


# def check_daily_limit():
#     def decorator(func):
#         @wraps(func)
#         async def wrapper(request: Request, db: Session = Depends(get_db), *args, **kwargs):
#             try:
                
#                 token = request.headers.get("Authorization")
#                 token = token.split(" ")[1]
#                 payload = decode_token(token)
#                 user_id = payload.get("user_id")
#                 # company_id = payload.get("company_id")
#                 user_fetch_resp =  fetch_users_exceeding_daily_limit(db,user_id)
#                  # Create the response data
#                 response_data = [{
#                     "usage_count": row[0],
#                     "start_date": row[1],
#                     "end_date": row[2],
#                     "plan_name": row[3],
#                     "price": row[4],
#                     "period": row[5],
#                     "api_name": row[6],
#                     "limit_count": row[7]
#                 } for row in user_fetch_resp]

                
#                  # Check if any usage count exceeds limit
#                 for data in response_data:
#                      if data["usage_count"] > data["limit_count"]:
#                         raise ApiRequestLimitExceededException(f'{data["period"]} with {data["plan_name"]} plan. Please contact Adminstrator')
#             except Exception as e:
#                 print("Rate Limit Exception",e)
#                 raise e
    
#             return await func(request, *args, db=db, **kwargs)
#         return wrapper
#     return decorator


@router.post("/dfm")
@check_daily_limit("dfm_analysis")
async def run_dfm_analysis(
    request: Request,
    usage_data: ApiUsageCreate,
    db: Session = Depends(get_db)
):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        payload = decode_token(token)
        user_id = payload.get("user_id")
        company_id = payload.get("company_id")
        company_id = None if payload.get("company_id") in (None, "None") else payload.get("company_id")
        user_id = None if payload.get("user_id") in (None, "None") else payload.get("user_id")
        
        payload={
            'user_id': user_id,
            'company_id': company_id,
            'api_name':'dfm_analysis'
        }
        
        new_log = log_api_usage(db, payload)
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


@router.post("/cnc")
@check_daily_limit("cnc_analysis")
async def run_cnc_analysis(
    request: Request,
    usage_data: ApiUsageCreate,
    db: Session = Depends(get_db)
):
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        payload = decode_token(token)
        user_id = payload.get("user_id")
        company_id = payload.get("company_id")
        company_id = None if payload.get("company_id") in (None, "None") else payload.get("company_id")
        user_id = None if payload.get("user_id") in (None, "None") else payload.get("user_id")
        
        payload={
            'user_id': user_id,
            'company_id': company_id,
            'api_name':'cnc_analysis'
        }
        
        new_log = log_api_usage(db, payload)
        return success_response(
            data=[],
            message="Run CNC Analysis API ",
            status_code=200
        )
    except Exception as e:
        logger.error("Error fetching exceeded usage data", exc_info=True)
        return error_response(
            message="Error fetching exceeded usage data.",
            debug=str(e),
            status_code=500
        )




