import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import os
from app.config.settings import get_settings
settings = get_settings()
from datetime import datetime

MAIL_USERNAME = settings.MAIL_USERNAME
MAIL_PASSWORD = settings.MAIL_PASSWORD
COMPANY_NAME = settings.COMPANY_NAME
COMPANY_LOGO_URL= settings.COMPANY_LOGO_URL
COMPANY_PRIMARY_COLOR ='#343A40'


template_dir = os.path.join(os.path.dirname(__file__), "../templates/email")
jinja_env = Environment(loader=FileSystemLoader(template_dir))

def generate_otp_code(length: int = 6) -> str:
    return ''.join(random.choices("0123456789", k=length))

def send_otp_email(to_email: str, otp_code: str, purpose: str = "register"):
    if purpose not in ["register", "forgot_password", "login"]:
        raise ValueError(f"No template found for purpose: {purpose}")

    subject_mapping = {
        "register": "Your OTP for Registration",
        "forgot_password": "Reset Password OTP",
        "login": "Your Login OTP"
    }

    subject = subject_mapping[purpose]
    template = jinja_env.get_template(f"{purpose}.html")
    html_body = template.render(otp_code=otp_code, 
        company_name=COMPANY_NAME,
        logo_url=COMPANY_LOGO_URL,
        primary_color=COMPANY_PRIMARY_COLOR,
        current_year=datetime.now().year,)
    text_body = f"Your OTP is: {otp_code}. It is valid for 10 minutes."

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = "noreply@yourdomain.com"
    msg["To"] = to_email

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(msg["From"], [msg["To"]], msg.as_string())
