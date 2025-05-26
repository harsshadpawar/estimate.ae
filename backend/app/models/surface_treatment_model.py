from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base

class SurfaceTreatment(Base):
    __tablename__ = "surface_treatments"

    id = Column(Integer, primary_key=True, index=True)
    surface_treat_name = Column(String, nullable=False, unique=True)
    price = Column(Float, nullable=False)
    price_unit = Column(String, nullable=False)
    material_groups = Column(String, nullable=True)


from pydantic import BaseModel
from typing import Optional

class SurfaceTreatmentBase(BaseModel):
    surface_treat_name: str
    price: float
    price_unit: str
    material_groups: str

class SurfaceTreatmentOut(SurfaceTreatmentBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes=True
