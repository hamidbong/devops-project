from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import time

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/service3_db")

# retry simple loop to wait for mongodb in compose
for i in range(10):
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        client.server_info()
        break
    except Exception as e:
        print("Waiting for MongoDB...", e)
        time.sleep(1)

db = client.get_database()
collection = db.get_collection("numbers")

@app.route("/api/number", methods=["GET"])
def get_number():
    doc = collection.find_one()
    if not doc:
        doc = {"value": 3334}  # numéro spécifique du service 3
        collection.insert_one(doc)
    return jsonify({"service": "Python", "number": int(doc["number"])})

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_RUN_PORT", 5003))
    app.run(host="0.0.0.0", port=port)
