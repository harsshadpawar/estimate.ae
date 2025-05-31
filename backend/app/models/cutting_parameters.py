from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base

class CuttingParameter(Base):
    __tablename__ = "cutting_parameters"

    id = Column(Integer, primary_key=True, index=True)
    tool_type = Column(String)
    operation_type = Column(String)
    tool_material = Column(String)
    tool_diameter_mm = Column(Integer)
    no_of_teeth = Column(Integer)
    material_group = Column(String)
    material_subgrade = Column(String)
    min_cutting_speed_m_per_min = Column(Integer)
    max_cutting_speed_m_per_min = Column(Integer)
    min_feed_per_tooth_rev_mm = Column(Float)
    max_feed_per_tooth_rev_mm = Column(Float)
    min_depth_of_cut_mm = Column(Integer)
    max_depth_of_cut_mm = Column(Integer)
    width_of_cut_stepover_mm = Column(String)
    coolant_requirement = Column(String)
    special_notes = Column(String)


from pydantic import BaseModel
from typing import Optional

class CuttingParameterBase(BaseModel):
    tool_type: str
    operation_type: str
    tool_material: str
    tool_diameter_mm: int
    no_of_teeth: int
    material_group: str
    material_subgrade: str
    min_cutting_speed_m_per_min: int
    max_cutting_speed_m_per_min: int
    min_feed_per_tooth_rev_mm: float
    max_feed_per_tooth_rev_mm: float
    min_depth_of_cut_mm: int
    max_depth_of_cut_mm: int
    width_of_cut_stepover_mm: str
    coolant_requirement: str
    special_notes: str


class CuttingParameterResponse(BaseModel):
    tool_type: str
    operation_type: str
    tool_material: str
    tool_diameter_mm: float
    no_of_teeth: int
    material_group: str
    material_subgrade: str
    min_cutting_speed_m_per_min: float
    max_cutting_speed_m_per_min: float
    min_feed_per_tooth_rev_mm: float
    max_feed_per_tooth_rev_mm: float
    min_depth_of_cut_mm: float
    max_depth_of_cut_mm: float
    width_of_cut_stepover_mm: str
    coolant_requirement: str
    special_notes: str

    class Config:
        orm_mode = True
        from_attributes=True