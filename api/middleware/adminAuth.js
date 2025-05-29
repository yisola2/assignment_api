const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { JWT_SECRET } = require('../config/jwt');

module.exports = async (req, res, next) => {

  console.log('[adminAuth.js] Headers reçus:', JSON.stringify(req.headers, null, 2));
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('[adminAuth.js] Aucun token fourni');
    return res.status(401).json({ error: 'Token manquant' });
  }

  console.log('[adminAuth.js] Token reçu:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[adminAuth.js] Token décodé:', decoded);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('[adminAuth.js] Utilisateur non trouvé pour ID:', decoded.userId);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    if (user.role !== 'admin') {
      console.log('[adminAuth.js] Accès refusé - rôle:', user.role);
      return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }
    
    console.log('[adminAuth.js] Accès admin accordé pour:', user.username);
    req.user = { userId: user._id, role: user.role };
    next();
  } catch (err) {
    console.error('[adminAuth.js] Erreur de vérification du token:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token invalide ou malformé' });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
}; 