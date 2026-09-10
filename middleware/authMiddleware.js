const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError('Access token not found', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});

module.exports = verifyAccessToken;