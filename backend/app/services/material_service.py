from sqlalchemy.orm import Session
from app.models.material_model import Material

def get_all_materials(db: Session):
    return db.query(Material).all()
