from sqlalchemy.orm import Session
from app.models.surface_treatment_model import SurfaceTreatment

def get_all_surface_treatments(db: Session):
    return db.query(SurfaceTreatment).all()
