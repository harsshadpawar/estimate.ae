from sqlalchemy.orm import Session
from datetime import datetime
from app.models.machine_model import MachineMaster
from app.exceptions.custom_exceptions import AlreadyExistsException, NotFoundException
from typing import List


def get_all_machines(db: Session) -> List[MachineMaster]:
    return db.query(MachineMaster).all()
