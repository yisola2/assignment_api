const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('[auth.js] Headers reçus:', JSON.stringify(req.headers, null, 2)); 
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
}; 