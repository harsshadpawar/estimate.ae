# app/models/otp.py

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.db import Base
from pydantic import BaseModel, EmailStr

# Enum type for OTP purposes
OTP_PURPOSE_ENUM = ('register', 'forgot_password','login')

class OTP(Base):
    __tablename__ = 'otps'

    otp_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey('users.id'))  # FK should match 'users.id' in your User model
    otp_code = Column(String, nullable=False)
    purpose = Column(Enum(*OTP_PURPOSE_ENUM, name='otp_purpose_enum'), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

    user = relationship("User", back_populates="otps")

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
    
class ForgetPasswordRequest(BaseModel):
    email: EmailStr      