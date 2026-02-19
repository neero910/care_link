const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateUserInput } = require('../middleware/validation');

router.post('/register', validateUserInput, register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;
