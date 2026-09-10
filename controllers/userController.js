const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};