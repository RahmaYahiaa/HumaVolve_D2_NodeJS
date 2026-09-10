const express = require('express');
const router = express.Router();

const { register, login, refreshToken, logout } = require('../controllers/authController');
const validateUserInput = require('../middleware/validateUser');

router.post('/register', validateUserInput, register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;