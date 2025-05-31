from sqlalchemy import Column, String, TIMESTAMP, Boolean, DateTime
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from sqlalchemy.sql import func
from app.database.db import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from uuid import uuid4

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, index=True)
    address = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    users = relationship("User", back_populates="company")
    
    

class CompanyCreate(BaseModel):
    name: str
    address: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website_url: Optional[str] = None
    is_active: Optional[bool] = True
    
    class Config:
      orm_mode = True
      from_attributes=True

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website_url: Optional[str] = None
    is_active: Optional[bool] = None
    
    class Config:
      orm_mode = True
      from_attributes=True

class CompanyOut(BaseModel):
    id: str
    name: str
    address: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    website_url: Optional[str]
    is_active: Optional[bool]
    created_by: Optional[str]
    updated_by: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
      orm_mode = True
      from_attributes=True   
      
    @validator('created_by', 'updated_by', pre=True)
    def uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v  