from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import time

app = Flask(__name__)
CORS(app)

# Récupération des variables d'environnement
user = os.getenv("MONGODB_ADMINUSERNAME")
password = os.getenv("MONGODB_ADMINPASSWORD")
hosts = os.getenv("URI_MONGODB_SERVER")  # Contient déjà tous les hôtes
database_name = os.getenv("MONGODB_DATABASE", "service3_db")
replica_set = os.getenv("MONGODB_REPLICA_SET", "rs0")
auth_source = "admin"

# Nettoyage de la variable hosts - retire mongodb:// si présent
if hosts.startswith("mongodb://"):
    hosts = hosts.replace("mongodb://", "")

# Construction de l'URI MongoDB
MONGO_URI = f"mongodb://{user}:{password}@{hosts}/{database_name}?replicaSet={replica_set}&authSource={auth_source}&retryWrites=true&w=majority"

# Pour le debug, afficher l'URI avec le mot de passe masqué
MONGO_URI_MASKED = MONGO_URI.replace(password, "*****") if password else MONGO_URI
print(f"🔧 MONGO_URI: {MONGO_URI_MASKED}")
print(f"🔧 Database: {database_name}")
print(f"🔧 Replica Set: {replica_set}")

# Boucle de reconnexion avec gestion d'erreurs améliorée
client = None
for i in range(10):
    try:
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=10000,  # 10 secondes au lieu de 5
            socketTimeoutMS=30000,
            connectTimeoutMS=15000,
            retryWrites=True,
            w="majority",
            readPreference='primaryPreferred'  # Préfère lire depuis le PRIMARY
        )
                
        # Test de connexion plus robuste
        client.admin.command('ping')
        print(f"✅ Tentative {i+1}/10 - Connecté à MongoDB avec succès")
        
        # Vérifier le statut du replica set
        try:
            rs_status = client.admin.command('replSetGetStatus')
            print(f"📊 Replica Set Status: {rs_status['set']}")
            for member in rs_status['members']:
                print(f"   - {member['name']}: {member['stateStr']}")
        except Exception as rs_error:
            print(f"⚠️  Note: {rs_error}")
            
        break
    except Exception as e:
        print(f"⏳ Tentative {i+1}/10 - Erreur: {str(e)[:100]}...")
        time.sleep(2)

if client is None:
    print("❌ Échec de la connexion à MongoDB après plusieurs tentatives")
    print("🔄 Tentative de connexion simple (sans replica set)...")
    # Fallback: essayer avec seulement le premier host
    try:
        # Prendre le premier host de la liste
        first_host = hosts.split(",")[0] if "," in hosts else hosts
        simple_uri = f"mongodb://{user}:{password}@{first_host}/{database_name}?authSource={auth_source}"
        print(f"🔄 Tentative avec: {simple_uri.replace(password, '*****')}")
        
        client = MongoClient(simple_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ Connecté en mode simple (sans replica set)")
    except Exception as fallback_error:
        print(f"❌ Échec de la connexion de fallback: {fallback_error}")
        raise SystemExit("Could not connect to MongoDB after retries")

db = client[database_name]
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
        client.admin.command('ping')
        return jsonify({
            "status": "healthy", 
            "database": "connected",
            "replica_set": replica_set,
            "database_name": database_name
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "database": "disconnected",
            "error": str(e)
        }), 500

@app.route("/debug", methods=["GET"])
def debug_info():
    """Endpoint pour debuguer la connexion MongoDB"""
    try:
        # Informations de connexion
        info = {
            "mongodb_uri_masked": MONGO_URI_MASKED,
            "database": database_name,
            "replica_set": replica_set,
            "hosts": hosts,
            "connection_status": "connected"
        }
        
        # Informations sur le replica set si disponible
        try:
            rs_status = client.admin.command('replSetGetStatus')
            info["replica_set_members"] = [
                {"name": m["name"], "state": m["stateStr"]} 
                for m in rs_status["members"]
            ]
        except:
            info["replica_set_members"] = "Not available"
            
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_RUN_PORT", 5003))
    print(f"🚀 Démarrage du service Python sur le port {port}")
    app.run(host="0.0.0.0", port=port, use_reloader=False)