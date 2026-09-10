const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyAccessToken(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access token expired' });
      }
      return res.status(403).json({ success: false, message: 'Invalid access token' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = verifyAccessToken;