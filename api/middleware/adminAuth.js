const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = async (req, res, next) => {

  console.log('[adminAuth.js] Headers reçus:', JSON.stringify(req.headers, null, 2));
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }
    
    req.user = { userId: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
}; 