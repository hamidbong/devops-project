from flask import Flask

app = Flask(__name__)

# Importer les routes pour enregistrer les endpoints
from app import routes
