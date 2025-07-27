from flask import Flask

app = Flask(__name__)

# Importer les routes pour enregistrer les endpointtts
from app import routes
