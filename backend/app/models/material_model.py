from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    material_abbreviation = Column(String, unique=True, nullable=False)
    material_name = Column(String, nullable=False)
    material_price_per_kg = Column(Float, nullable=False)
    price_unit = Column(String, nullable=False)
    material_density = Column(Float, nullable=False)
    density_unit = Column(String, nullable=False)


from pydantic import BaseModel
from typing import Optional

class MaterialOut(BaseModel):
    id: int
    material_abbreviation: str
    material_name: str
    material_price_per_kg: float
    price_unit: str
    material_density: float
    density_unit: str

    class Config:
        orm_mode = True
        from_attributes=True
        
