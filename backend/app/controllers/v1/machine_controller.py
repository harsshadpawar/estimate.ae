from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.machine_service import get_all_machines
from app.models.machine_model import MachineOut
from app.exceptions.custom_exceptions import AlreadyExistsException,NotFoundException
from app.main import logger
from app.utils.response import success_response,error_response
from app.utils.role_checker import require_roles_from_token
from typing import List

router = APIRouter()

@router.get("/")
def get_machines(db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin","user","editor","admin")) ):
    try:
        machines = get_all_machines(db)
        machines_out = [
            MachineOut.from_orm(machine).dict() for machine in machines
        ]

        return success_response(
            data=machines_out,
            message="Machines fetched successfully.",
            status_code=200
        )
    except Exception as e:
        logger.error("Unexpected error during machine fetch", exc_info=True)
        return error_response(
            message="Unexpected error during machine fetch.",
            debug=str(e),
            status_code=500
        )
