from sqlalchemy.orm import Session
from app.models.log_model import Log

def save_log(db: Session, level: str, message: str, endpoint: str = None):
    log = Log(level=level, message=message, endpoint=endpoint)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
