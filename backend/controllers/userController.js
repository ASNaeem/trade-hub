const userService = require("../services/userService");
const User = require("../models/userSchema"); // Add this import
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check for duplicates
    const duplicates = await userService.isDuplicate(email, phone);
    if (duplicates.email) {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (duplicates.phone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }
    if (!name || !phone) {
    return res.status(400).json({ message: "Validation failed: name and phone are required" });
    }
    // Create a new user
    const newUser = await userService.createUser(name, email, phone, password);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.getSummary(),
    });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const { user, token } = await userService.authenticateUser(email, password);

    res.status(200).json({ 
      message: "Login successful",
      token,
      user: user.getSummary(),
    });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Ensure `user` is defined
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(`Error in /api/users/profile -`, error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, password } = req.body;

    const user = await User.findById(userId); // Fetch user from database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and update fields
    if (phone && !/^\+?\d{10,14}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(`Error in /api/users/profile -`, error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user is added by authenticateUser middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete the user
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(500).json({ message: "Server error" });
  }
};

