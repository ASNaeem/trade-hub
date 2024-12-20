const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");
const authMiddleware = require("../middleware/authMiddleware");

// Create verification token
router.post("/verification", authMiddleware, async (req, res) => {
  try {
    const token = await tokenService.createToken(req.user.id, "verification");
    res.status(201).json({ tokenValue: token.tokenValue });
  } catch (error) {
    res.status(500).json({ message: "Error creating token", error: error.message });
  }
});

// Verify token
router.post("/verify", async (req, res) => {
  try {
    const { tokenValue, type } = req.body;
    const token = await tokenService.verifyToken(tokenValue, type);
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying token", error: error.message });
  }
});

// Delete token (for logout or manual invalidation)
router.delete("/:tokenValue", authMiddleware, async (req, res) => {
  try {
    const success = await tokenService.deleteToken(req.params.tokenValue);
    if (!success) {
      return res.status(404).json({ message: "Token not found" });
    }
    res.status(200).json({ message: "Token deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting token", error: error.message });
  }
});

module.exports = router; 