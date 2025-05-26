import re
from datetime import datetime,date


def validate_otp_code(otp_code: str):
    otp = otp_code.strip()
    if not (otp.isdigit() and len(otp) == 6):
        raise ValueError("OTP code must be a 6-digit number")
    return otp 

def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
        raise ValueError("Password must contain at least one letter and one number")
    return v


def validate_phone(v: str) -> str:
    if v and not re.fullmatch(r"\d{10}", v):
        raise ValueError("Phone number must be a 10-digit numeric string")
    return v


# def validate_date_of_birth(v: str) -> str:
#     if v:
#         try:
#             dob = datetime.strptime(v, "%Y-%m-%d")
#         except ValueError:
#             raise ValueError("Date of birth must be in 'YYYY-MM-DD' format")

#         today = datetime.utcnow()
#         if dob > today:
#             raise ValueError("Date of birth cannot be in the future")

#         age = (today - dob).days // 365
#         if age < 18:
#             raise ValueError("User must be at least 18 years old")
#     return v

def validate_date_of_birth(v):
    if v:
        if isinstance(v, str):
            try:
                dob = datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError("Date of birth must be in 'YYYY-MM-DD' format")
        elif isinstance(v, date):
            dob = v
        else:
            raise TypeError("Date of birth must be a string or date object")

        today = datetime.utcnow().date()
        if dob > today:
            raise ValueError("Date of birth cannot be in the future")

        age = (today - dob).days // 365
        if age < 18:
            raise ValueError("User must be at least 18 years old")
    return v


def validate_gender(v: str) -> str:
    allowed = {"male", "female", "other"}
    if v and v.lower() not in allowed:
        raise ValueError(f"Gender must be one of {allowed}")
    return v.lower() if v else v
