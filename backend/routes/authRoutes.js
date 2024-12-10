const express = require('express');
const { registerUser, verifyOTP } = require('../controllers/authController');
const router = express.Router();

// Registration Route
router.post('/register', registerUser);

// OTP Verification Route
router.post('/verify-otp', verifyOTP);

module.exports = router;