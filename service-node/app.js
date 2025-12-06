const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");



const PORT = process.env.PORT || 5001;

// Récupération des variables d'environnement
const user = process.env.MONGODB_ADMINUSERNAME;
const pass = process.env.MONGODB_ADMINPASSWORD;
const hosts = process.env.URI_MONGODB_SERVER || "mongodb-0.mongodb-headless.default.svc.cluster.local:27017,mongodb-1.mongodb-headless.default.svc.cluster.local:27017,mongodb-2.mongodb-headless.default.svc.cluster.local:27017";
const databaseName = process.env.MONGODB_DATABASE || "service1_db";
const replicaSet = process.env.MONGODB_REPLICA_SET || "rs0";
const authSource = "admin";

// Nettoyage de la variable hosts
let cleanedHosts = hosts;
if (cleanedHosts.startsWith("mongodb://")) {
    cleanedHosts = cleanedHosts.replace("mongodb://", "");
}

// Construction de l'URI MongoDB avec replica set
const MONGO_URI = `mongodb://${user}:${pass}@${cleanedHosts}/${databaseName}?replicaSet=${replicaSet}&authSource=${authSource}&retryWrites=true&w=majority`;

// URI masquée pour les logs (sécurité)
const MONGO_URI_MASKED = MONGO_URI.replace(pass, "*****");
console.log("🌌 Node.js – Service en éveil…");
console.log(`🔧 Tentative de connexion à MongoDB...`);
console.log(`🔧 URI: ${MONGO_URI_MASKED}`);
console.log(`🔧 Base de données: ${databaseName}`);
console.log(`🔧 Replica Set: ${replicaSet}`);

const app = express();
app.use(cors());
app.use(express.json());

// Connexion avec retry automatique
async function connectWithRetry() {
  console.log("🔎 Tentative de connexion à MongoDB…");

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 150000,   // timeout connexion
      connectTimeoutMS: 150000,           // timeout handshake
    });

    console.log("✅ Connecté avec succès à MongoDB (Node service)");
  } catch (err) {
    console.error(`⛔ Connexion MongoDB échouée : ${err.message}`);
    console.log("⏳ Nouvelle tentative dans 10 secondes…");
    setTimeout(connectWithRetry, 10000);
  }
}

connectWithRetry();

// --- Example model ---
const numberSchema = new mongoose.Schema({ number: Number });
const NumberModel = mongoose.model("Number", numberSchema);

// --- Routes ---
app.get("/api/number", async (req, res) => {
  try {
    let doc = await NumberModel.findOne();
    if (!doc) {
      doc = new NumberModel({ number: 111444 });
      await doc.save();
    }
    res.json({ service: "Node.js", number: doc.number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(PORT, () =>
  console.log(`🚀 Service Node.js opérationnel sur le port ${PORT}`)
);
