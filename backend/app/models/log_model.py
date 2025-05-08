from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from app.database.db import Base
from datetime import datetime
class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, index=True)
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    endpoint = Column(String, nullable=True)
