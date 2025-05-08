from sqlalchemy.orm import Session
from app.models.role_model import Role
from app.models.user_model import User, UserCreate
from uuid import uuid4
from typing import List, Optional
from fastapi import HTTPException, status
from app.main import logger
from app.exceptions.custom_exceptions import AlreadyExistsException, NotFoundException
from datetime import datetime, timedelta
from app.utils.hashing import hash_password
from app.utils.otp_utils import send_otp_email,generate_otp_code
from app.models.opt_model import OTP, VerifyOtpRequest, ResetPasswordRequest
from sqlalchemy.orm.exc import NoResultFound

DEFAULT_ROLE_NAME = "user"

def get_or_create_default_role(db: Session):
    role = db.query(Role).filter(Role.name == DEFAULT_ROLE_NAME).first()
    if not role:
        role = Role(id=uuid4(), name=DEFAULT_ROLE_NAME, description="Default user role")
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def register_user(user_data, db: Session):
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise AlreadyExistsException("Email Already Exist")
    
    # Check if role is provided, if not create default role
    role = None
    if user_data.role_id:
        role = db.query(Role).filter(Role.id == user_data.role_id).first()
        if not role:
            raise NotFoundException("Role Not Found")
    else:
        # Assuming `get_or_create_default_role` is a helper function to fetch or create a default role
        role = get_or_create_default_role(db)

    # Create a new user
    new_user = User(
        id=str(uuid4()),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        phone=user_data.phone,
        date_of_birth=user_data.date_of_birth,
        gender=user_data.gender,
        role_id=role.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified = False,
        is_active = False
    )
   
    otp_code = generate_otp_code()
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)
    otp = OTP(
        user_id=new_user.id,
        otp_code=otp_code,
        purpose="register",
        expires_at=otp_expiry,
    )
    
    send_otp_email(new_user.email,otp_code,"register")
   
    
    db.add(new_user)
    db.flush()  # to ensure new_user.id is available before using it in OTP
    db.add(otp)
    db.commit()
    db.refresh(new_user)
    
    return new_user




def verify_otp_service(data: VerifyOtpRequest, db: Session):
    try:
        otp_query = (
            db.query(OTP)
            .join(User)
            .filter(
                User.email == data.email,
                OTP.otp_code == data.otp_code,
                OTP.purpose == data.purpose,
                OTP.is_used == False,
                OTP.expires_at >= datetime.utcnow()
            )
        )
    
        # print("Compiled SQL Query:")
        # print(str(otp_query.statement.compile(compile_kwargs={"literal_binds": True})))
        otp = otp_query.first()
        
        if not otp:
            raise NotFoundException("Invalid or expired OTP.")

        otp.is_used = True
        db.commit()
        db.refresh(otp)
        
        # Update User as verified and active
        user = otp.user  
        user.email_verified = True
        user.is_active = True
        db.commit()
        db.refresh(user)

        return {
            "email": otp.user.email,  # access email from related User model
            "verified": True
        }

    except NoResultFound:
        raise NotFoundException("Invalid or expired OTP.")


def forget_password_service(data: ResetPasswordRequest, db: Session):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise NotFoundException("User not found.")


    otp_code = generate_otp_code()
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)
    otp = OTP(
        user_id=user.id,
        otp_code=otp_code,
        purpose="forgot_password",
        expires_at=otp_expiry,
    )
    
    send_otp_email(user.email,otp_code,"forgot_password")
    
    db.add(otp)
    db.commit()
    db.refresh(otp)
    
    return {"email": user.email, "otp_sent": True}



def reset_password_service(data: ResetPasswordRequest, db: Session):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise NotFoundException("User not found.")

    otp = db.query(OTP).filter(
        OTP.user_id == user.id,
        OTP.otp_code == data.otp_code,
        OTP.purpose == "forgot_password",
        OTP.expires_at > datetime.utcnow()
    ).first()

    if not otp:
        raise ValueError("Invalid or expired OTP.")

    try:
        # Hash and update password
        user.password_hash = hash_password(data.new_password)
        db.delete(otp)
        db.flush()  
        db.commit()
        db.refresh(user)

    except Exception as e:
        db.rollback()
        logger.error(f"Password reset failed for {data.email}: {e}", exc_info=True)
        raise e
    














# Get User by Email
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Retrieve a user from the database by their email.
    """
    return db.query(User).filter(User.email == email).first()


# Get User by ID
def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Retrieve a user from the database by their ID.
    """
    return db.query(User).filter(User.id == user_id).first()




# Update User
def update_user(
    db: Session,
    user_id: int,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    email: Optional[str] = None,
    password: Optional[str] = None,
    role: Optional[str] = None
) -> User:
    """
    Update user details.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if first_name:
        db_user.first_name = first_name
    if last_name:
        db_user.last_name = last_name
    if email:
        db_user.email = email
    if password:
        db_user.password_hash = Hash.bcrypt(password)
    if role:
        db_user.role = role

    db.commit()
    db.refresh(db_user)
    return db_user


# Delete User
def delete_user(db: Session, user_id: int) -> None:
    """
    Delete a user from the database.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(db_user)
    db.commit()


# Get All Users
def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Retrieve all users from the database with pagination.
    """
    return db.query(User).offset(skip).limit(limit).all()
