const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateRegistration } = require('../middleware/validation');

// Auth Routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
