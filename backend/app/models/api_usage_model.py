from sqlalchemy import Column, Integer, String, ForeignKey,DateTime
from app.database.db import Base
from datetime import datetime

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApiUsage(Base):
    __tablename__ = "api_usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    company_id = Column(String, ForeignKey('companies.id'), nullable=True)
    api_name = Column(String)
    called_at = Column(DateTime, default=datetime.utcnow)



class ApiUsageCreate(BaseModel):
    data: Optional[str]=None
    # user_id: Optional[str] = None
    # company_id: Optional[str] = None
    # api_name: str
    class Config:
        orm_mode = True
from_attributes = True


class ApiUsageResponse(ApiUsageCreate):
    id: int
    called_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
        

