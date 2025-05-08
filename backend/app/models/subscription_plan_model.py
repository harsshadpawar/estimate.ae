from sqlalchemy import Column, Integer, String, DECIMAL, Text, TIMESTAMP,Enum
from sqlalchemy.sql import func
from app.database.db import Base  
import enum

class PlanName(str, enum.Enum):
    free = "Free"
    premium = "Premium"
    enterprise = "Enterprise"

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    price = Column(DECIMAL(10, 2), default=0.00)
    features = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
