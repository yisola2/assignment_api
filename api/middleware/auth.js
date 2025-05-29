const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

module.exports = (req, res, next) => {
  console.log('[auth.js] Headers reçus:', JSON.stringify(req.headers, null, 2)); 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    console.log('[auth.js] Aucun token fourni');
    return res.status(401).json({ error: 'Token manquant' });
  }

  console.log('[auth.js] Token reçu:', token.substring(0, 20) + '...');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('[auth.js] Erreur de vérification du token:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expiré' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token invalide ou malformé' });
      }
      return res.status(403).json({ error: 'Token invalide' });
    }
    
    console.log('[auth.js] Token vérifié avec succès pour userId:', decoded.userId);
    req.user = decoded;
    next();
  });
}; 