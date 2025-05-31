# tests/test_main.py

import pytest
from fastapi.testclient import TestClient
from app.main import app  # import your FastAPI app
import os

client = TestClient(app)

def get_test_headers():
    return {
        "x-api-key": os.environ["X_API_KEY"]
    }

def test_root():
    response = client.get("/", headers=get_test_headers())
    # assert response.status_code == 200
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}  # adjust based on your main.py

def test_user_registration():
    payload = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "strongPassword123",
    "phone": "1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "male"
    }
    response = client.post("v1/user/register", json=payload, headers=get_test_headers())
    print(">>response",response)
    assert response.status_code == 201  # Expecting 201 Created
    data = response.json()
    assert "id" in data or "email" in data

