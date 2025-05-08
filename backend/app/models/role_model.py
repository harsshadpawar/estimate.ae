import enum
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.database.db import Base
import uuid
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import date

class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)

    users = relationship("User", back_populates="role")
class RoleOut(BaseModel):
    id: str  # id as string
    name: str

    class Config:
        orm_mode = True
        from_attributes = True    