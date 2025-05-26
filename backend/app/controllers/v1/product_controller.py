from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.product_service import create_product, get_all_products,update_existing_product, get_product_by_id_service
from app.models.product_model import ProductCreate, ProductOut, ProductUpdate
from app.exceptions.custom_exceptions import AlreadyExistsException,NotFoundException
from app.main import logger
from app.utils.response import success_response,error_response
from app.utils.role_checker import require_roles_from_token
from typing import List

router = APIRouter()

@router.post("/create")
def product_create( product: ProductCreate, db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        created_product = create_product(db, product, user_payload)
        print("created_product",ProductOut.from_orm(created_product).dict())
        create_product_final = ProductOut.from_orm(created_product).dict()
        create_product_final['created_at'] = created_product.created_at.isoformat()
        create_product_final['updated_at'] = created_product.updated_at.isoformat()
      
        logger.info(f"Product created: {created_product.name}")

        return success_response(
            data= create_product_final,
            message="Product created successfully.",
            status_code=201
        )
    except AlreadyExistsException as e:
        logger.error(f"Product creation failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=400)
    except Exception as e:
        logger.error("Unexpected error during product creation", exc_info=True)
        return error_response(
            message="Unexpected error during product creation.",
            debug=str(e),
            status_code=500
        )

@router.get("/")
def get_products(db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin")) ):
    try:
        products = get_all_products(db)
        products_out = [
            {**ProductOut.from_orm(product).dict(), 'created_at': product.created_at.isoformat(), 'updated_at': product.updated_at.isoformat()}
            for product in products
        ]

        return success_response(
            data= products_out,  
            message="Products fetched successfully.",
            status_code=200
        )
    except Exception as e:
        logger.error("Unexpected error during products fetch", exc_info=True)
        return error_response(
            message="Unexpected error during products fetch.",
            debug=str(e),
            status_code=500
        )
        
 
@router.get("/{product_id}")
def get_product_by_id( product_id: int, db: Session = Depends(get_db),user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        product = get_product_by_id_service(db, product_id)
        if not product:
            raise NotFoundException("Product not found.")

        product_out = {
            **ProductOut.from_orm(product).dict(),
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat()
        }

        return success_response(
            data=product_out,
            message="Product fetched successfully.",
            status_code=200
        )
    except NotFoundException as e:
        logger.error(f"Product fetch failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)
    except Exception as e:
        logger.error("Unexpected error during product fetch", exc_info=True)
        return error_response(
            message="Unexpected error during product fetch.",
            debug=str(e),
            status_code=500
        )       
        

@router.put("/update/{product_id}")
def update_product( product_id: int,product_data: ProductUpdate,db: Session = Depends(get_db),user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        updated_product = update_existing_product(db, product_id, product_data, user_payload)

        updated_product_out = {
            **ProductOut.from_orm(updated_product).dict(),
            'created_at': updated_product.created_at.isoformat(),
            'updated_at': updated_product.updated_at.isoformat()
        }

        return success_response(
            data=updated_product_out,
            message="Product updated successfully.",
            status_code=200
        )
    except NotFoundException as e:
        logger.error(f"Product update failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=404)
    except Exception as e:
        logger.error("Unexpected error during product update", exc_info=True)
        return error_response(
            message="Unexpected error during product update.",
            debug=str(e),
            status_code=500
        )