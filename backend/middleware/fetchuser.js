const jwt = require('jsonwebtoken');
const JWT_SECRET = "SecretKeyString"; 
const User = require('../models/User');

const fetchUser = (req, res, next) => {
  // Get the token from the header
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');

  try {
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

module.exports = fetchUser;
