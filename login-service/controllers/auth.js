const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    // Créer un nouvel utilisateur
    const user = new User({ username, password });
    await user.save();

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};