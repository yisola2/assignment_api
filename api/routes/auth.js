const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !', user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });

    // Générer un token JWT avec la clé centralisée
    const payload = { 
      userId: user._id, 
      role: user.role,
      iat: Math.floor(Date.now() / 1000) // Date de création
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    console.log('[AUTH] Token généré pour utilisateur:', user.username);
    console.log('[AUTH] Payload du token:', payload);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('[AUTH] Erreur lors de la connexion:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;