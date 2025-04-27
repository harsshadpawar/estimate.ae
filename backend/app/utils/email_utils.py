# app/utils/email_utils.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import HTTPException, status
from pydantic import EmailStr
import os
from app.utils.response_handler import error_response
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_DEFAULT_SENDER", "it.estimate.ae@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_register_mail(email: EmailStr, otp_code: str, page_type: str):
    try:
        if page_type == "Registration":
            subject = "Your OTP for Registration"
            body = f"Your OTP is {otp_code}. Use this to complete your registration."
        else:
            subject = "Your OTP for Password Reset"
            body = f"Your OTP is {otp_code}. Use this to reset your password."

        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=body,
            subtype="plain"  # Or use "html" for HTML content
        )

        fm = FastMail(conf)
        await fm.send_message(message)

        print(f"OTP email sent to {email}")
        return True

    except Exception as e:
        print(f"Email sending failed: {e}")
        return error_response("Failed to send OTP email", status_code=400)
