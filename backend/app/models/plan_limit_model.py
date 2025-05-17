from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database.db import Base

class PlanLimit(Base):
    __tablename__ = "plan_limits"

    id = Column(Integer, primary_key=True, index=True)
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id", ondelete="CASCADE"), nullable=False)
    period = Column(String(20), nullable=False)
    api_name = Column(String(100), nullable=False) 
    limit_count = Column(Integer, nullable=False)

    # subscription_plan = relationship("SubscriptionPlan", back_populates="limits")

    __table_args__ = (
        CheckConstraint("period IN ('daily', 'weekly','monthly','yearly')", name="valid_periods"),
    )
