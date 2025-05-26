from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.company_model import CompanyCreate, CompanyUpdate, CompanyOut
from app.services.company_crud_service import (
    create_company,
    get_all_companies,
    get_company_by_id,
    update_company,
    deactivate_company
)
from app.utils.response import success_response, error_response
from app.exceptions.custom_exceptions import NotFoundException, AlreadyExistsException
from app.utils.role_checker import require_roles_from_token


router = APIRouter()


@router.post("/create")
def create_company_route(company: CompanyCreate, db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        new_company = create_company(db, company)
        
        new_company_data = CompanyOut.from_orm(new_company).dict()
        new_company_data['created_at'] = new_company.created_at.isoformat()
        new_company_data['updated_at'] = new_company.updated_at.isoformat()

        return success_response(data=new_company_data, message="Company created", status_code=201)
    except AlreadyExistsException as e:
        return error_response(str(e), status_code=400)
    except Exception as e:
        return error_response("Unexpected error during company creation", debug=str(e))


@router.get("/")
def get_all(db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        companies = get_all_companies(db)
        result = [
            {**CompanyOut.from_orm(c).dict(), "created_at": c.created_at.isoformat(), "updated_at": c.updated_at.isoformat()}
            for c in companies
        ]
        return success_response(data=result, message="Companies fetched")
    except Exception as e:
        return error_response("Unexpected error during company fetch", debug=str(e))


@router.get("/{company_id}")
def get_by_id(company_id: str, db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        company = get_company_by_id(db, company_id)
        result = CompanyOut.from_orm(company).dict()
        result["created_at"] = company.created_at.isoformat()
        result["updated_at"] = company.updated_at.isoformat()
        return success_response(data=result, message="Company fetched")
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response("Unexpected error", debug=str(e))


@router.put("/{company_id}")
def update(company_id: str, company: CompanyUpdate, db: Session = Depends(get_db), user_payload=Depends(require_roles_from_token("super-admin"))):
    try:
        updated = update_company(db, company_id, company)
        result = CompanyOut.from_orm(updated).dict()
        result["created_at"] = updated.created_at.isoformat()
        result["updated_at"] = updated.updated_at.isoformat()
        return success_response(data=result, message="Company updated")
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response("Unexpected error during update", debug=str(e))



@router.delete("/{company_id}")
def delete(
    company_id: str,
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin"))
):
    try:
        company = deactivate_company(db, company_id)
        result = CompanyOut.from_orm(company).dict()
        result["created_at"] = company.created_at.isoformat()
        result["updated_at"] = company.updated_at.isoformat()
        return success_response(message="Company deactivated successfully",data=result, status_code=200)
    except NotFoundException as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        db.rollback()  # Important: rollback if exception occurs
        return error_response("Unexpected error during deactivation", debug=str(e))
