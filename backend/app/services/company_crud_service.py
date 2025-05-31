from sqlalchemy.orm import Session
from typing import List
from app.models.company_model import Company
from app.models.company_model import CompanyCreate, CompanyUpdate
from app.exceptions.custom_exceptions import NotFoundException, AlreadyExistsException
import uuid


def create_company(db: Session, company_data: CompanyCreate) -> Company:
    existing = db.query(Company).filter(Company.name == company_data.name).first()
    if existing:
        raise AlreadyExistsException(f"Company with this name {company_data.name}")

    company = Company(
        **company_data.dict()
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def get_all_companies(db: Session) -> List[Company]:
    return db.query(Company).filter(Company.is_active == True).all()


def get_company_by_id(db: Session, company_id: str) -> Company:
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise NotFoundException("Company not found.")
    return company


def update_company(db: Session, company_id: str, company_data: CompanyUpdate) -> Company:
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise NotFoundException("Company not found.")

    for key, value in company_data.dict(exclude_unset=True).items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)
    return company



def deactivate_company(db: Session, company_id: str):
    company = db.query(Company).filter(Company.id == company_id, Company.is_active == True).first()
    
    if not company:
        raise NotFoundException("Company not found or already inactive")
    
    company.is_active = False
    db.commit()
    db.refresh(company)
    return company
