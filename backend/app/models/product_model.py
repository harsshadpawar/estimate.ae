from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database.db import Base
from pydantic import BaseModel, validator
from typing import Optional
import uuid

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    class Config:
      orm_mode = True
      from_attributes=True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    class Config:
        orm_mode = True
        from_attributes=True
        

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    created_by: str
    updated_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes=True

    @validator('created_by', 'updated_by', pre=True)
    def uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
    