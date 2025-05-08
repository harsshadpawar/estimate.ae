import enum
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.types import Date
from app.database.db import Base
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from sqlalchemy.dialects.postgresql import UUID
import uuid
from uuid import uuid4
from datetime import date
from app.models.role_model import RoleOut

import pytz
IST = pytz.timezone("Asia/Kolkata")
now_ist = datetime.now(IST)


class SubscriptionPlan(str, enum.Enum):
    free = "free"
    premium = "premium"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)  # UUID as string
    first_name = Column(String, nullable=False)
    last_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)

    role_id = Column(String, ForeignKey("roles.id"), nullable=False)
    company_id = Column(String, ForeignKey('companies.id'), nullable=True)
    
    role = relationship("Role", back_populates="users")
    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")

    company = relationship("Company", back_populates="users")
    # subscriptions = relationship("Subscription", back_populates="users")



    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.free)
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    last_login_at = Column(DateTime)

    address = Column(JSON, nullable=True)  # JSON field for address
    profile_image_url = Column(String, nullable=True)

    created_by = Column(UUID(as_uuid=True), nullable=True)
    updated_by = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserCreate(BaseModel):
    first_name: str
    last_name: Optional[str]
    email: EmailStr
    password: str
    phone: Optional[str]
    date_of_birth: Optional[str]  
    gender: Optional[str]
    role_id: Optional[str] = None

    class Config:
        orm_mode = True
        
class UserOut(BaseModel):
    id: str  # id as string
    first_name: str
    last_name: Optional[str]
    email: EmailStr
    role: RoleOut

    class Config:
        orm_mode = True
        from_attributes=True
                
                
class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    token = Column(String, primary_key=True, index=True)
    blacklisted_on = Column(DateTime, default=datetime.utcnow)

                   