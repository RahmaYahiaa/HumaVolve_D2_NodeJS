const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const validateUserInput = require('../middleware/validateUser');
const verifyAccessToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', verifyAccessToken, authorizeRoles('admin'), getAllUsers);
router.get('/:id', verifyAccessToken,authorizeRoles('admin'), getUserById);
router.post('/', verifyAccessToken, authorizeRoles('admin'), validateUserInput, createUser);
router.put('/:id', verifyAccessToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', verifyAccessToken, authorizeRoles('admin'), deleteUser);

module.exports = router;