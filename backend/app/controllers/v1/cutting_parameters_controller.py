from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.cutting_parameters_service import get_all_cutting_parameters
from app.models.cutting_parameters   import CuttingParameterResponse 
from app.utils.response import success_response, error_response
from app.utils.role_checker import require_roles_from_token

router = APIRouter()


@router.get("/")
def get_cutting_parameters(
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin","user","admin","editor"))
):
    try:
        parameters = get_all_cutting_parameters(db)
        parameters_out = [
            CuttingParameterResponse.from_orm(param).dict()
            for param in parameters
        ]
        return success_response(
            data=parameters_out,
            message="Cutting parameters fetched successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Unexpected error during cutting parameters fetch.",
            debug=str(e),
            status_code=500
        )


