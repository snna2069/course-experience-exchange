const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

async function optionalAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (!token) {
    return next();
  }

  try {
    if (scheme !== 'Bearer' || !config.JWT_SECRET) {
      return next();
    }
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findById(payload.sub).select('_id name email');
  } catch (error) {
    // Public course reads remain available when no valid user is supplied.
  }
  next();
}

module.exports = optionalAuth;
