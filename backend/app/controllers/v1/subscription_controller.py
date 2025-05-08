from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.subscription_model import SubscriptionCreate, SubscriptionUpdate, SubscriptionOut
from app.services.subscription_service import (
    create_subscription,
    get_all_subscriptions,
    get_subscription,
    update_subscription,
    delete_subscription
)
from app.utils.response import success_response, error_response
from app.exceptions.custom_exceptions import NotFoundException , AlreadyExistsException
from app.utils.role_checker import require_roles_from_token
from app.main import logger
router = APIRouter()



@router.post("/create")
def create_subscription_route(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin","user"))
):
    try:
        # Create subscription using the service function
        new_subscription = create_subscription(db, subscription)

        # Convert the ORM object to a Pydantic model dictionary
        subscription_data = SubscriptionOut.from_orm(new_subscription).dict()

        # Handle ISO format for datetime fields (if available)
        subscription_data['created_at'] = new_subscription.created_at.isoformat() if new_subscription.created_at else None
        subscription_data['updated_at'] = new_subscription.updated_at.isoformat() if new_subscription.updated_at else None
        subscription_data['start_date'] = new_subscription.start_date.isoformat() if new_subscription.start_date else None
        subscription_data['end_date'] = new_subscription.end_date.isoformat() if new_subscription.end_date else None

        # Return success response

        print("subscription_data",subscription_data)

        # Return success response
        return success_response(
            data=subscription_data,
            message="Subscription created successfully",
            status_code=201
        )

    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    
    except AlreadyExistsException as e:
        # logger.error(f"Product creation failed: {str(e)}", exc_info=True)
        return error_response(message=str(e), status_code=400)
    
    except Exception as e:
        return error_response("Unexpected error during subscription creation", debug=str(e))




@router.get("/{subscription_id}")
def get_subscription_route(
    subscription_id: int,
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin"))
):
    try:
        subscription = get_subscription(db, subscription_id)
        return success_response(
            data=SubscriptionOut.from_orm(subscription),
            message="Subscription fetched successfully"
        )
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response("Unexpected error during fetching subscription", debug=str(e))


@router.get("/")
def get_all_subscriptions_route(
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin"))
):
    try:
        subscriptions = get_all_subscriptions(db)
        data = [SubscriptionOut.from_orm(s) for s in subscriptions]
        return success_response(data=data, message="All subscriptions fetched successfully")
    except Exception as e:
        return error_response("Unexpected error during fetching subscriptions", debug=str(e))


@router.put("/{subscription_id}")
def update_subscription_route(
    subscription_id: int,
    subscription_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin"))
):
    try:
        updated = update_subscription(db, subscription_id, subscription_data)
        return success_response(
            data=SubscriptionOut.from_orm(updated),
            message="Subscription updated successfully"
        )
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response("Unexpected error during updating subscription", debug=str(e))


@router.delete("/{subscription_id}")
def delete_subscription_route(
    subscription_id: int,
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin"))
):
    try:
        result = delete_subscription(db, subscription_id)
        return success_response(message="Subscription deleted successfully", status_code=200)
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response("Unexpected error during deleting subscription", debug=str(e))
