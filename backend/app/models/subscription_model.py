from sqlalchemy import Column, Integer, ForeignKey, Date, String, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database.db import Base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from sqlalchemy import Column, String, DateTime


from pydantic import BaseModel, validator
from datetime import date, datetime
from typing import Optional
from uuid import UUID
import uuid

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    company_id = Column(String, ForeignKey('companies.id'), nullable=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    subscription_plan_id = Column(Integer, ForeignKey('subscription_plans.id'))
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)
    status = Column(String, default="active")

    # user = relationship("User", back_populates="subscriptions")
    # company = relationship("Company", back_populates="subscriptions")
    
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SubscriptionCreate(BaseModel):
    user_id: Optional[str] = None
    company_id: Optional[str] = None
    product_id: int
    subscription_plan_id: int
    start_date: date
    end_date: date
    status: Optional[str] = None
    created_at: Optional[datetime]= None
    updated_at: Optional[datetime]= None

    class Config:
        orm_mode = True
        from_attributes = True    

class SubscriptionUpdate(BaseModel):
    id: int
    user_id: Optional[str]
    company_id: Optional[str]
    product_id: Optional[int]
    subscription_plan_id: Optional[int]
    start_date: Optional[date]
    end_date: Optional[date]
    status: Optional[str]
    
    class Config:
        orm_mode = True
        from_attributes = True



class SubscriptionOut(BaseModel):
    id: int
    user_id: Optional[str] 
    company_id: Optional[str]
    product_id: Optional[int]
    subscription_plan_id: Optional[int]
    start_date: Optional[date]
    end_date: Optional[date]
    status: Optional[str]
    created_by: Optional[str]
    updated_by: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
        from_attributes = True

    @validator('created_by', 'updated_by', pre=True)
    def uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

