from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.surface_treatment_service import get_all_surface_treatments
from app.models.surface_treatment_model import SurfaceTreatmentOut
from app.utils.response import success_response, error_response
from app.utils.role_checker import require_roles_from_token

router = APIRouter()

@router.get("/", response_model=dict)
def fetch_surface_treatments(
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        treatments = get_all_surface_treatments(db)
        return success_response(
            data=[SurfaceTreatmentOut.from_orm(t).dict() for t in treatments],
            message="Surface treatments fetched successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching surface treatments.",
            debug=str(e),
            status_code=500
        )
