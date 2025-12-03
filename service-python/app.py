from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import time

app = Flask(__name__)
CORS(app)

user = os.getenv("MONGODB_ADMINUSERNAME")
password = os.getenv("MONGODB_ADMINPASSWORD")
host = os.getenv("URI_MONGODB_SERVER")      # ex: mongodb-service
port = os.getenv("MONGODB_PORT", "27017")

MONGO_URI = f"mongodb://{user}:{password}@{host}:{port}/service3_db?authSource=admin"

# Boucle de reconnexion avec gestion d'erreurs améliorée
client = None
for i in range(10):
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()  # Test de connexion
        print("✅ Connecté à MongoDB avec succès")
        break
    except Exception as e:
        print(f"⏳ Tentative {i+1}/10 - En attente de MongoDB... Erreur: {e}")
        time.sleep(2)

if client is None:
    print("❌ Échec de la connexion à MongoDB après plusieurs tentatives")
    raise SystemExit("Could not connect to MongoDB after retries")

db = client.service3_db
collection = db.numbers

@app.route("/api/number", methods=["GET"])
def get_number():
    try:
        doc = collection.find_one()
        if not doc:
            doc = {"number": 333444}
            collection.insert_one(doc)
        return jsonify({"service": "Python", "number": int(doc["number"])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    try:
        client.server_info()
        return jsonify({"status": "healthy", "database": "connected"})
    except:
        return jsonify({"status": "unhealthy", "database": "disconnected"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_RUN_PORT", 5003))
    app.run(host="0.0.0.0", port=port, use_reloader=False)

