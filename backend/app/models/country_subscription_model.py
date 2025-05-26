from sqlalchemy import Column, String, Boolean, DateTime, DECIMAL, ForeignKey, Integer, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime
from app.database.db import Base

class CountrySubscriptionPlan(Base):
    __tablename__ = "country_subscription_plans"
    id = Column(Integer, primary_key=True)
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id", ondelete="CASCADE"))
    country_code = Column(String(2), ForeignKey("countries.code", ondelete="CASCADE"))
    price = Column(DECIMAL(10, 2))
    features = Column(Text)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    
