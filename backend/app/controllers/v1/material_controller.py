from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.material_service import get_all_materials
from app.models.material_model import MaterialOut
from app.utils.response import success_response, error_response
from app.utils.role_checker import require_roles_from_token

router = APIRouter()

@router.get("/", response_model=dict)
def fetch_materials(
    db: Session = Depends(get_db),
    user=Depends(require_roles_from_token("admin", "user", "editor", "super-admin"))
):
    try:
        materials = get_all_materials(db)
        result = [MaterialOut.from_orm(m).dict() for m in materials]
        return success_response(
            data=result,
            message="Materials fetched successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch materials.",
            debug=str(e),
            status_code=500
        )
