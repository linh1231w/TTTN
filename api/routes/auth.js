// routes/authRoutes.js

const express = require('express');
const { login } = require('../controllers/Site/User/authController');

const router = express.Router();

// Endpoint để đăng nhập
router.post('/login', login);

module.exports = router;
