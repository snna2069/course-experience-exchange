const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

async function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token || !config.JWT_SECRET) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication required' });
  }
}

module.exports = requireAuth;
