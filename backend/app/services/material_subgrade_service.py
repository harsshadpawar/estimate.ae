from sqlalchemy.orm import Session
from app.models.material_subgrade_model import MaterialSubgrade

def get_all_material_subgrades(db: Session):
    return db.query(MaterialSubgrade).all()
