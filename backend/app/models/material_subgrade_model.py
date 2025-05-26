from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base

class MaterialSubgrade(Base):
    __tablename__ = "material_subgrades"

    id = Column(Integer, primary_key=True, index=True)
    material_abbreviation = Column(String, nullable=False)
    material_name = Column(String, nullable=False)
    material_price_per_kg = Column(Float, nullable=False)
    price_unit = Column(String, nullable=False)
    material_density_g_cm3 = Column(Float, nullable=False)
    density_unit = Column(String, nullable=False)


from pydantic import BaseModel

class MaterialSubgradeOut(BaseModel):
    id: int
    material_abbreviation: str
    material_name: str
    material_price_per_kg: float
    price_unit: str
    material_density_g_cm3: float
    density_unit: str

    class Config:
        orm_mode = True
        from_attributes = True
