from sqlalchemy.orm import Session
from app.models.subscription_model  import Subscription, SubscriptionCreate, SubscriptionUpdate
from fastapi import HTTPException, status
from app.exceptions.custom_exceptions import NotFoundException, AlreadyExistsException
from app.models.user_model import User
from app.models.company_model import Company
from app.models.product_model import Product
from app.models.subscription_plan_model import SubscriptionPlan
from sqlalchemy import text

def create_subscription(db: Session, subscription_data: SubscriptionCreate):
    # Check if user_id is provided and validate user
    if subscription_data.user_id:
        user = db.query(User).filter(User.id == subscription_data.user_id).first()
        if not user or not user.is_active:
            raise NotFoundException("User not found or inactive")
    
    # Check if company_id is provided and validate company
    if subscription_data.company_id:
        company = db.query(Company).filter(Company.id == subscription_data.company_id).first()
        if not company or not company.is_active:
            raise NotFoundException("Company not found or inactive")

    # Check if product_id is provided and validate product
    if subscription_data.product_id:
        product = db.query(Product).filter(Product.id == subscription_data.product_id).first()
        if not product or not product.is_active:
            raise NotFoundException("Product not found or inactive")

    # Check if subscription_plan_id is provided and validate subscription plan
    if subscription_data.subscription_plan_id:
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription_data.subscription_plan_id).first()
        if not plan:
            raise NotFoundException("Subscription plan not found")
        
        # check 1User, 1product Subscription
    if subscription_data.user_id:
        query = text("""
        SELECT 1
        FROM subscriptions
        WHERE user_id = :user_id
          AND product_id = :product_id
          AND status = 'active'
        LIMIT 1
        """)
        
        result = db.execute(query, {
            "user_id": subscription_data.user_id,
            "product_id": subscription_data.product_id
        }).fetchone()

        if result:
            raise AlreadyExistsException("User already has an active subscription for this product") 

    # Create new subscription record
    subscription = Subscription(**subscription_data.dict())
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription



def get_subscription(db: Session, subscription_id: int):
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return subscription


def get_all_subscriptions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Subscription).offset(skip).limit(limit).all()

# def get_subscription_by_id(db: Session, subscription_id: int):
#     subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
#     if not subscription:
#         raise NotFoundException(f"Subscription with ID {subscription_id} not found")
#     return subscription

def update_subscription(db: Session, subscription_id: int, subscription_data: SubscriptionUpdate):
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    
    for key, value in subscription_data.dict(exclude_unset=True).items():
        setattr(subscription, key, value)

    db.commit()
    db.refresh(subscription)
    return subscription


def delete_subscription(db: Session, subscription_id: int):
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    db.delete(subscription)
    db.commit()
    return {"detail": "Subscription deleted successfully"}
