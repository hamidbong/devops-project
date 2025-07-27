from app.routes import app  # Updated import path
from flask import jsonify, request

def test_home():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200
    assert b"Bienvenue" in response.data
