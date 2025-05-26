from sqlalchemy.orm import Session
from app.models.cutting_parameters  import CuttingParameter


def get_all_cutting_parameters(db: Session):
    return db.query(CuttingParameter).all()


def get_cutting_parameters_by_material(db: Session, material_group: str, material_subgrade: str):
    return db.query(CuttingParameter).filter(
        CuttingParameter.material_group == material_group,
        CuttingParameter.material_subgrade == material_subgrade
    ).all()
