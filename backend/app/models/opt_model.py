# app/models/otp.py

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.db import Base
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import validates
from sqlalchemy import CheckConstraint
from pydantic import validator
import re

# Enum type for OTP purposes
OTP_PURPOSE_ENUM = ('register', 'forgot_password','login')

class OTP(Base):
    __tablename__ = 'otps'

    otp_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey('users.id'))  # FK should match 'users.id' in your User model
    otp_code = Column(String(6), nullable=False)
    purpose = Column(Enum(*OTP_PURPOSE_ENUM, name='otp_purpose_enum'), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

    user = relationship("User", back_populates="otps")
    
    
    @validates('otp_code')
    def validate_otp_code(self, key, value):
        if len(value) != 6:
            raise ValueError("OTP code must be exactly 6 characters long")
        return value

class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp_code: str
    purpose: str

class VerifyOtpResponse(BaseModel):
    email: EmailStr
    verified: bool

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str    
    
    @validator('new_password')
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError("Password must contain at least one letter and one number")
        return v
    
class ForgetPasswordRequest(BaseModel):
    email: EmailStr      