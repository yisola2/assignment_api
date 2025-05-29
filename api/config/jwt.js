// Configuration JWT centralisée
const JWT_SECRET = process.env.JWT_SECRET || 'macle_2024!@#$%^&*()';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN: '1h'
}; 