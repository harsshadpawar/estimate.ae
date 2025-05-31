from fastapi import Request, Depends
from sqlalchemy.orm import Session
from functools import wraps
from app.database.db import get_db
from app.services.api_usage_service import fetch_users_exceeding_daily_limit
from app.exceptions.custom_exceptions import ApiRequestLimitExceededException
from app.utils.jwt_utils import decode_token


def check_daily_limit(api_name: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, db: Session = Depends(get_db), *args, **kwargs):
            try:
                
                token = request.headers.get("Authorization")
                token = token.split(" ")[1]
                payload = decode_token(token)
                user_id = payload.get("user_id")
                # company_id = payload.get("company_id")
                user_fetch_resp =  fetch_users_exceeding_daily_limit(db,user_id,api_name)
                print("user fetch",user_fetch_resp,api_name)
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

                 
                 # Check if any usage count exceeds limit
                for data in response_data:
                     if data["usage_count"] > data["limit_count"]:
                        raise ApiRequestLimitExceededException(f'{data["period"]} with {data["plan_name"]} plan for {data["api_name"]}. Please contact Adminstrator')
            except Exception as e:
                print("Rate Limit Exception",e)
                raise e
    
            return await func(request, *args, db=db, **kwargs)
        return wrapper
    return decorator
