const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb-service:27017/service3_db";

// Debug: Afficher l'URI (masquer le mot de passe)
const maskedUri = MONGO_URI.replace(/(\/\/)(.*?)(@)/, (match, p1, p2, p3) => {
  return p1 + '****:****' + p3;
});
console.log(`MongoDB URI: ${maskedUri}`);
console.log(`PORT: ${PORT}`);

const app = express();
app.use(cors());
app.use(express.json());

// Options de connexion améliorées
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
};

// Fonction de connexion avec retry
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  
  mongoose.connect(MONGO_URI, mongooseOptions)
    .then(() => {
      console.log("✅ Connected to MongoDB successfully");
      console.log(`Database: ${mongoose.connection.name}`);
      console.log(`Host: ${mongoose.connection.host}`);
      console.log(`Port: ${mongoose.connection.port}`);
    })
    .catch(err => {
      console.error("❌ MongoDB connection error:", err.message);
      console.error("Error details:", err);
      
      // Afficher plus d'informations de débogage
      if (err.message.includes('getaddrinfo')) {
        console.error("DNS resolution error - check if 'mongodb-service' is a valid service name");
      }
      if (err.message.includes('authentication')) {
        console.error("Authentication error - check username/password in connection string");
      }
      
      // Tentative de reconnexion après 5 secondes
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

// Événements de connexion
mongoose.connection.on('connecting', () => {
  console.log('Mongoose is connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  // Tentative de reconnexion
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Démarrer la connexion
setTimeout(connectWithRetry, 1000);

const numberSchema = new mongoose.Schema({ 
  number: { 
    type: Number, 
    required: true 
  } 
});
const NumberModel = mongoose.model("Number", numberSchema);

// Health check endpoint
app.get("/health", async (req, res) => {
  const health = {
    service: "Node.js",
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    },
    environment: {
      port: PORT,
      nodeVersion: process.version
    }
  };
  
  // Vérifier la connexion à la base de données
  if (mongoose.connection.readyState !== 1) {
    health.status = "degraded";
    health.database.error = "Not connected to database";
    return res.status(503).json(health);
  }
  
  // Tester une opération simple sur la base de données
  try {
    await NumberModel.findOne().maxTimeMS(5000);
    health.database.operation = "success";
  } catch (dbErr) {
    health.status = "degraded";
    health.database.operation = "failed";
    health.database.error = dbErr.message;
  }
  
  res.json(health);
});

app.get("/api/number", async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        service: "Node.js",
        number: 1114,
        error: "Database not connected",
        timestamp: new Date().toISOString()
      });
    }
    
    let doc = await NumberModel.findOne().maxTimeMS(10000);
    if (!doc) {
      doc = new NumberModel({ number: 1114 });
      await doc.save();
    }
    res.json({ 
      service: "Node.js", 
      number: doc.number,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error in /api/number:", err);
    res.status(500).json({ 
      service: "Node.js", 
      number: 1114,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route racine
app.get("/", (req, res) => {
  res.json({
    service: "Node.js Service",
    status: "running",
    endpoints: [
      { path: "/", method: "GET", description: "Service info" },
      { path: "/health", method: "GET", description: "Health check" },
      { path: "/api/number", method: "GET", description: "Get service number" }
    ],
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Service Node.js listening on port ${PORT}`);
});