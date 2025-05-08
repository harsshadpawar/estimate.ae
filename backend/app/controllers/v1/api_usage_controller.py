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
router = APIRouter()

@router.post("/create")
def create_api_usage_log(
    request: Request,
    usage_data: ApiUsageCreate,
    db: Session = Depends(get_db),
    # user_payload=Depends(require_roles_from_token(""))
):
    try:
        new_log = log_api_usage(db, usage_data)
        log_dict = ApiUsageResponse.from_orm(new_log).dict()
        log_dict['called_at'] = new_log.called_at.isoformat()

        logger.info(f"API usage logged for API: {new_log.api_name}")

        return success_response(
            data=log_dict,
            message="API usage logged successfully.",
            status_code=201
        )
    except Exception as e:
        logger.error("Unexpected error during API usage logging", exc_info=True)
        return error_response(
            message="Unexpected error during API usage logging.",
            debug=str(e),
            status_code=500
        )



@router.get("/usage_count_exceeded/{user_id}")
def get_usage_count_exceeded(
    request: Request,
    user_id: str,   
    db: Session = Depends(get_db)
):
    try:
        result = fetch_users_exceeding_daily_limit(db,user_id)
        print("result",result)
        logger.info("Fetched exceeded usage counts.")
        return success_response(
            # data=[dict(row._mapping) for row in result],
            data=[serialize_row(row) for row in result],
            message="Users exceeding daily API usage limit.",
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
