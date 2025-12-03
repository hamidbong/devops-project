const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5001;

const user = process.env.MONGODB_ADMINUSERNAME;
const pass = process.env.MONGODB_ADMINPASSWORD;
const host = process.env.URI_MONGODB_SERVER;   // ex: mongodb-service
const port = process.env.MONGODB_PORT;

// URI via Service Kubernetes (stable)
const MONGO_URI = `mongodb://${user}:${pass}@${host}:${port}/service3_db?authSource=admin` || "mongodb://mongodb-service:27017/service2_db?authSource=admin";

// Petite bannière magique pour l'ambiance ✨
console.log("🌌 Node.js – Service en éveil… préparation à la connexion MongoDB");

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
