const AppError = require('../utils/AppError');

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateFieldsDB(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
}

function handleValidationErrorDB(err) {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(messages.join(', '), 400);
}

function handleJWTError() {
  return new AppError('Invalid token', 403);
}

function handleJWTExpiredError() {
  return new AppError('Token expired', 401);
}

function errorHandler(err, req, res, next) {
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong';

  if (!error.isOperational) {
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler;