import enum
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.types import Date
from app.database.db import Base
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional
from sqlalchemy.dialects.postgresql import UUID
import uuid
from uuid import uuid4
from datetime import date
from app.models.role_model import RoleOut
import re
import pytz
IST = pytz.timezone("Asia/Kolkata")
now_ist = datetime.now(IST)
from app.utils.validators import validate_date_of_birth,validate_gender,validate_phone,validate_password_strength


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
    
    
    @validator('password')
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError("Password must contain at least one letter and one number")
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.fullmatch(r'\d{10}', v):
            raise ValueError("Phone number must be a 10-digit numeric string")
        return v

    @validator('date_of_birth')
    def validate_date_of_birth(cls, v): 
        if v:
            try:
                dob = datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError("Date of birth must be in 'YYYY-MM-DD' format")

            today = datetime.utcnow()
            if dob > today:
                raise ValueError("Date of birth cannot be in the future")
            age = (today - dob).days // 365
            if age < 18:
                raise ValueError("User must be at least 18 years old")
            
        return v



    @validator('gender')
    def validate_gender(cls, v):
        allowed = {'male', 'female', 'other'}
        if v and v.lower() not in allowed:
            raise ValueError(f"Gender must be one of {allowed}")
        return v.lower() if v else v


    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[dict] = None
    profile_image_url: Optional[str] = None


    @validator('phone')
    def validate_phone(cls, v):
        return validate_phone(v)

    @validator('gender')
    def validate_gender(cls, v):
       return validate_gender(v)
   
    @validator("date_of_birth")
    def dob_v(cls, v):
        return validate_date_of_birth(v)

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
                
                
class UserAllOut(BaseModel):
    id: str
    first_name: str
    last_name: Optional[str]
    email: EmailStr
    phone: Optional[str]
    gender: Optional[str]
    date_of_birth: Optional[date]
    address: Optional[dict]
    profile_image_url: Optional[str]
    subscription_plan: Optional[str] 
    email_verified: bool 
    is_active: bool 
    last_login_at: Optional[datetime] = None
    created_at: datetime = None
    updated_at: datetime = None
    role_name: str  

    class Config:
        orm_mode = True
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None,
            date: lambda v: v.isoformat() if v else None
        } 


                
class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    token = Column(String, primary_key=True, index=True)
    blacklisted_on = Column(DateTime, default=datetime.utcnow)


class RoleAssign(BaseModel):
    role_name: str