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

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validateUserInput, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;