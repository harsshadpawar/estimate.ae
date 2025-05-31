from sqlalchemy.orm import Session
from datetime import datetime
from app.models.product_model import Product, ProductCreate, ProductUpdate
from app.exceptions.custom_exceptions import AlreadyExistsException, NotFoundException
from typing import List

def create_product(db: Session, product_data: ProductCreate, user_payload):
    
    existing = db.query(Product).filter(Product.name == product_data.name).first()
    if existing:
        raise AlreadyExistsException(f"Product with this name {product_data.name}")
    
    user_id = str(user_payload.get('sub')) if user_payload.get('sub') else None

    product = Product(
        **product_data.dict(),
        created_by=user_id,
        updated_by=user_id,  
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_all_products(db: Session) -> List[Product]:
    return db.query(Product).all()

def get_product_by_id_service(db: Session, product_id: int) -> Product:
    return db.query(Product).filter(Product.id == product_id).first()


def update_existing_product(db: Session, product_id: int, product_data: ProductUpdate, user_payload):
    product = db.query(Product).filter(Product.id == product_id).first()
    print("product",product)
    if not product:
        raise NotFoundException("Product not found.")

    user_id = str(user_payload.get('sub')) if user_payload.get('sub') else None

    if product_data.name is not None:
        product.name = product_data.name
    if product_data.description is not None:
        product.description = product_data.description
    if product_data.is_active is not None: 
        product.is_active = product_data.is_active       

    product.updated_by = user_id
    product.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(product)
    return product
