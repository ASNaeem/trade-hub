const User = require("../models/User");
const { sendOTPEmail } = require("../utils/emailService");
const crypto = require("crypto");

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save user with OTP and hashed password
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password, // Hash this in the model or using bcrypt
      otp,
      otpExpiration: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });
    await user.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "User registered! Please verify OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if OTP matches and is still valid
    if (user.otp === otp && user.otpExpiration > Date.now()) {
      user.isVerified = true;
      user.otp = undefined; // Clear OTP
      user.otpExpiration = undefined; // Clear expiration
      await user.save();

      res.status(200).json({ message: "User verified successfully!" });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { registerUser, verifyOTP };
