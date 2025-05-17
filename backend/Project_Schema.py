from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

from .database import Base

class Tenant(Base):
    __tablename__ = 'tenants'
    
    tenant_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    users = relationship("User", back_populates="tenant")


class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey('tenants.tenant_id'))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum('Admin', 'User', 'Editor', 'Viewer', name='role_enum'), nullable=False, default='User')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tenant = relationship("Tenant", back_populates="users")
    otp = relationship("OTP", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class OTP(Base):
    __tablename__ = 'otps'
    
    otp_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    otp_code = Column(String, nullable=False)
    purpose = Column(Enum('register', 'forgot_password', name='otp_purpose_enum'), nullable=False)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="otp")


class Product(Base):
    __tablename__ = 'products'
    
    product_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    version = Column(String, nullable=False)
    image_url = Column(String, nullable=True)


class Subscription(Base):
    __tablename__ = 'subscriptions'
    
    subscription_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    product_id = Column(UUID(as_uuid=True), ForeignKey('products.product_id'))
    subscription_type = Column(Enum('Free', 'Premium', 'Enterprise', name='subscription_type_enum'), nullable=False)
    trial_period = Column(Integer, nullable=True)  # Duration in days
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="subscriptions")
    product = relationship("Product", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")
    invoices = relationship("Invoice", back_populates="subscription")
    rate_limits = relationship("RateLimit", back_populates="subscription")


class Payment(Base):
    __tablename__ = 'payments'
    
    payment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey('subscriptions.subscription_id'))
    amount = Column(Integer, nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow)
    payment_status = Column(Enum('Pending', 'Completed', 'Failed', name='payment_status_enum'), default='Pending')

    subscription = relationship("Subscription", back_populates="payments")


class Invoice(Base):
    __tablename__ = 'invoices'
    
    invoice_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey('subscriptions.subscription_id'))
    invoice_date = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Integer, nullable=False)
    invoice_status = Column(Enum('Paid', 'Unpaid', 'Overdue', name='invoice_status_enum'), default='Unpaid')

    subscription = relationship("Subscription", back_populates="invoices")


class RateLimit(Base):
    __tablename__ = 'rate_limits'
    
    rate_limit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey('subscriptions.subscription_id'))
    product_id = Column(UUID(as_uuid=True), ForeignKey('products.product_id'))
    request_quota = Column(Integer, nullable=False)
    reset_time = Column(Enum('Daily', 'Monthly', name='reset_time_enum'), nullable=False)

    subscription = relationship("Subscription", back_populates="rate_limits")
    product = relationship("Product")


class Notification(Base):
    __tablename__ = 'notifications'
    
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
