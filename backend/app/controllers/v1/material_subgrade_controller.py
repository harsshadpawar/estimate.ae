from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.material_subgrade_service import get_all_material_subgrades
from app.models.material_subgrade_model import MaterialSubgradeOut
from app.utils.response import success_response, error_response
from app.main import logger
from typing import List

router = APIRouter()

@router.get("/", response_model=List[MaterialSubgradeOut])
def fetch_material_subgrades(db: Session = Depends(get_db)):
    try:
        subgrades = get_all_material_subgrades(db)
        serialized_subgrades = [
            MaterialSubgradeOut.from_orm(sg).dict() for sg in subgrades
        ]
        return success_response(
            data=serialized_subgrades,
            message="Subgrades fetched successfully."
        )
    except Exception as e:
        logger.error("Failed to fetch material subgrades", exc_info=True)
        return error_response(message="Error fetching subgrades", debug=str(e))
