# app/schemas/schema_mixins.py

import re
from pydantic import validator

class PhoneValidatorMixin:
    @validator("phone")
    def validate_phone(cls, v):
        if v and not re.fullmatch(r'\d{10}', v):
            raise ValueError("Phone number must be a 10-digit numeric string")
        return v
