import pytest
from app import app as flask_app

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Bienvenue dans l'API Flask simple !!!!" in response.data

def test_get_empty_users(client):
    response = client.get('/users')
    assert response.status_code == 200
    assert response.json == []

def test_add_user(client):
    test_data = {'name': 'Test User'}
    response = client.post('/users', json=test_data)
    assert response.status_code == 201
    assert 'id' in response.json
    assert response.json['name'] == 'Test User'

def test_add_user_invalid(client):
    response = client.post('/users', json={})
    assert response.status_code == 400
    assert 'error' in response.json