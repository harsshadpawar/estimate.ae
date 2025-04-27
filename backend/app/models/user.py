from app.config.extensions import Base  # Import Base from extensions
import bcrypt
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship  # Import relationship from sqlalchemy.orm

class User(Base):  # Use Base from extensions
    __tablename__ = 'user'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    title = Column(String(50))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    company_name = Column(String(100))
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(50), default='customer')
    otp = Column(String(50))
    is_active = Column(Boolean, nullable=False, default=False)
    is_verified = Column(Boolean, nullable=False, default=False)
    
    # Establish a reverse relationship with CADFile
    cad_files = relationship('CADFile', back_populates='owner', cascade="all, delete-orphan")

    # Relationship to Machine
    machines = relationship('Machine', back_populates='owner', cascade="all, delete-orphan")

    # Relationship to Material
    materials = relationship('Material', back_populates='owner')  # Link to Material

    # Relationship to SurfaceTreatment
    surface_treatments = relationship('SurfaceTreatment', back_populates='owner')  # Link to Surface

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        return f"<User {self.email}>"
