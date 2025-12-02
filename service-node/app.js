const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5001;
const MONGO_URI2 = process.env.MONGO_URI || "mongodb://mongodb-service:27017/service3_db";
const MONGO_URI3 = "mongodb://admin:password123@10.244.230.24:27017/service3_db?authSource=admin";

const MONGO_URI = "mongodb://admin:password123@mongodb-service.default.svc.cluster.local:27017/service3_db?authSource=admin";
const app = express();
app.use(cors());
app.use(express.json());

async function connectWithRetry() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB (Node service)");
  } catch (err) {
    console.error("MongoDB connection failed, retrying in 5s:", err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();


/*mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB (Node service)");
}).catch(err => {
  console.error("MongoDB connection error (Node):", err.message);
});
*/
const numberSchema = new mongoose.Schema({ number: Number });
const NumberModel = mongoose.model("Number", numberSchema);

app.get("/api/number", async (req, res) => {
  try {
    let doc = await NumberModel.findOne();
    if (!doc) {
      doc = new NumberModel({ number: 1114 }); // numéro spécifique du service 1
      await doc.save();
    }
    res.json({ service: "Node.js", number: doc.number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Service Node.js listening on ${PORT}`));
