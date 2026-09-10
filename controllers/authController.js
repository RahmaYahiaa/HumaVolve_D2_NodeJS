const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  res.status(201).json({ success: true, data: user });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  res.status(200).json({ success: true, data: user });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new AppError('Refresh token not found', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const newAccessToken = generateAccessToken(user._id);

  res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

  res.status(200).json({ success: true, message: 'Access token refreshed' });
});

function logout(req, res) {
  res.clearCookie('accessToken', accessTokenCookieOptions);
  res.clearCookie('refreshToken', refreshTokenCookieOptions);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}

module.exports = { register, login, refreshToken, logout };