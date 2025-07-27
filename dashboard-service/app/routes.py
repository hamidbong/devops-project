from app import app
from flask import jsonify, request

# Stockage temporaire (en mémoire)
users = []

@app.route('/')
def home():
    return "Bienvenue dans l'API Flask simple !"

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Nom requis'}), 400
    user = {'id': len(users) + 1, 'name': data['name']}
    users.append(user)
    return jsonify(user), 201
