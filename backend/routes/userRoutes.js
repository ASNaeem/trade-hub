const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const authMiddleware = require("../middleware/authMiddleware");

// Test route
router.get("/", (req, res) => {
  res.send("User routes are working!");
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await userService.createUser(name, email, phone, password);
    res.status(201).json({
      message: "User registered successfully",
      user: result.user.getSummary(),
      token: result.token,
    });
  } catch (error) {
    if (
      error.message.includes("already registered") ||
      error.message.includes("must be at least 8 characters") ||
      error.message.includes("validation failed")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
    res.status(200).json({
      message: "Login successful",
      user: result.user.getSummary(),
      token: result.token,
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.getSummary());
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await userService.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser.getSummary());
  } catch (error) {
    if (
      error.message.includes("already registered") ||
      error.message.includes("must be at least 8 characters") ||
      error.message.includes("Invalid phone")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// Delete user profile
router.delete("/profile", authMiddleware, async (req, res) => {
  try {
    const success = await userService.deleteUser(req.user.id);
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
