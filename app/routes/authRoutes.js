const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/check', AuthController.checkAuth);

module.exports = router;
