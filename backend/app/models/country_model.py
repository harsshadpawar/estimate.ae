from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime
from app.database.db import Base

class Country(Base):
    __tablename__ = "countries"
    code = Column(String(2), primary_key=True)
    name = Column(String(100), nullable=False)
    iso3_code = Column(String(3))
    currency_code = Column(String(3))
    currency_symbol = Column(String(5))
    phone_code = Column(String(10))
    continent = Column(String(50))
    timezone = Column(String(100))
    language_code = Column(String(10))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

