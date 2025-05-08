git clone https://github.com/shrijagtap96/ProductPro.git
git checkout dev
python -m venv venv

#pip freeze > requirements.txt

pip install -r requirements.txt

//activate
source venv/bin/activate

===============<<<<< Docker >>>>>>==========================

docker-compose up 

// all volumes taken 
docker-compose down -v



PYTHONDONTWRITEBYTECODE=1 uvicorn app.main:app --reload





// Run with no cache and enviroment passing
PYTHONDONTWRITEBYTECODE=1 ENV=staging uvicorn app.main:app --reload





=============== Kibana ================

docker exec -it elasticsearch /bin/bash

bin/elasticsearch-create-enrollment-token -s kibana

bin/kibana-verification-code

// reset password
bin/elasticsearch-reset-password -u elastic

user: elastic
password: cqyzNo3fLfhkhKXzatBU


docker logs elasticsearch | grep "Password for the elastic user"

docker restart elasticsearch


pip install elasticsearch==8.0.0
Make sure you're installing the latest version of 8.x to be compatible with Elasticsearch 8.x server.



===== Database Migration =======================

Option 1: Use Base.metadata.create_all()
🧱 Option 2: Use Alembic (recommended for production)




=====Email Setup =======

Enable 2-Step Verification

    Go to: https://myaccount.google.com/security

    Under "Signing in to Google", turn on 2-Step Verification.

Generate an App Password

    Go to: https://myaccount.google.com/apppasswords

    Choose:

        App: "Mail"

        Device: "Other" → Name it (e.g., FastAPI)

    Google will give you a 16-character password.

    This is what you use in your .env or settings as MAIL_PASSWORD.

    ⚠️ This app password replaces your normal Gmail password for SMTP login.

Use the App Password in Your Code



====== Test Cases =========

PYTHONDONTWRITEBYTECODE=1 pytest --cov=app --cov-report=term-missing

if using .coveragrc

PYTHONDONTWRITEBYTECODE=1 ENV=staging pytest --cov=app --cov-fail-under=80


// Run with enviroment
PYTHONDONTWRITEBYTECODE=1 ENV=staging pytest --cov=app


=================== Manage TimeZone =================

To manage timezones consistently across your FastAPI + SQLAlchemy project, you should adopt a structured approach where:
    ✅ All timestamps are stored in UTC (best practice).
    🌐 IST (or any other timezone) is used for display, logging, and user interaction.
    🧠 Conversion is handled in a single utility, and timezone is centralized in settings/env.


