from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.db import Base

from pydantic import BaseModel, Field
from typing import Optional


class MachineMaster(Base):
    __tablename__ = "machine_master"

    id = Column(Integer, primary_key=True, index=True)
    machine_abbreviation = Column(String, unique=True, nullable=False, index=True)
    machine_category = Column(String, nullable=False)
    machine_subcategory = Column(String, nullable=False)
    name = Column(String, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    working_span = Column(String, nullable=False)
    machine_setup_time = Column(Integer, nullable=True)
    avg_programming_time = Column(Integer, nullable=True)

    overrides = relationship("MachineOverride", back_populates="master")


class MachineOverride(Base):
    __tablename__ = "machine_override"

    id = Column(Integer, primary_key=True, index=True)
    machine_abbreviation = Column(String, ForeignKey("machine_master.machine_abbreviation"), nullable=False)
    user_id = Column(Integer, nullable=True, index=True)
    company_id = Column(Integer, nullable=True, index=True)
    country_id = Column(Integer, nullable=True, index=True)

    hourly_rate = Column(Float, nullable=True)
    working_span = Column(String, nullable=True)
    machine_setup_time = Column(Integer, nullable=True)
    avg_programming_time = Column(Integer, nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "company_id", "country_id", "machine_abbreviation", name="uq_override_scope"),
    )

    master = relationship("MachineMaster", back_populates="overrides")





class MachineMasterBase(BaseModel):
    machine_abbreviation: str
    machine_category: str
    machine_subcategory: str
    name: str
    hourly_rate: float
    working_span: str
    machine_setup_time: Optional[int] = None
    avg_programming_time: Optional[int] = None

class MachineMasterCreate(MachineMasterBase):
    pass

class MachineMasterResponse(MachineMasterBase):
    id: int

    class Config:
        orm_mode = True
        
class MachineOut(BaseModel):
    id: int
    machine_abbreviation: str
    machine_category: str
    machine_subcategory: str
    name: str
    hourly_rate: float
    working_span: str
    machine_setup_time: Optional[int]
    avg_programming_time: Optional[int]

    class Config:
        orm_mode = True
        from_attributes=True


class MachineOverrideBase(BaseModel):
    machine_abbreviation: str
    user_id: Optional[int] = None
    company_id: Optional[int] = None
    country_id: Optional[int] = None

    hourly_rate: Optional[float] = None
    working_span: Optional[str] = None
    machine_setup_time: Optional[int] = None
    avg_programming_time: Optional[int] = None

class MachineOverrideCreate(MachineOverrideBase):
    pass

class MachineOverrideResponse(MachineOverrideBase):
    id: int

    class Config:
        orm_mode = True
