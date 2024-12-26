const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");
const authMiddleware = require("../middleware/authMiddleware");

// Create verification token
router.post("/verification", authMiddleware, async (req, res) => {
  try {
    const token = await tokenService.createToken(req.user.id, "verification");
    res.status(201).json({ token: token.tokenValue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating token", error: error.message });
  }
});

// Verify token
router.post("/verify", async (req, res) => {
  try {
    const { token, type } = req.body;
    const verifiedToken = await tokenService.verifyToken(token, type);
    if (!verifiedToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
});

// Delete token (for logout or manual invalidation)
router.delete("/:token", authMiddleware, async (req, res) => {
  try {
    const token = await tokenService.findToken(req.params.token);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    // Check if the token belongs to the authenticated user
    if (token.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this token" });
    }

    const deleted = await tokenService.deleteToken(req.params.token);
    if (!deleted) {
      return res.status(404).json({ message: "Token not found" });
    }
    res.status(200).json({ message: "Token deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting token", error: error.message });
  }
});

module.exports = router;
