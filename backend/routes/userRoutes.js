const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const authMiddleware = require("../middleware/authMiddleware");
const itemService = require("../services/itemService");

// Test route
router.get("/", (req, res) => {
  res.send("User routes are working!");
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check for existing user by email or phone
    const duplicateCheck = await userService.isDuplicate(email, phone);

    if (duplicateCheck.email) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (duplicateCheck.phone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Add password length validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const result = await userService.createUnverifiedUser(
      name,
      email,
      phone,
      password
    );

    res.status(201).json({
      message: "Please check your email for verification code",
      token: result.token,
      email: email,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error.message.includes("Password must be at least 8 characters long") ||
      error.name === "ValidationError" ||
      error.message.includes("validation failed")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Verify email with OTP
router.post("/verify-email", async (req, res) => {
  try {
    const { tokenValue, email } = req.body;

    // Verify the token
    const verificationResult = await userService.verifyUserEmail(
      email,
      tokenValue
    );

    if (verificationResult.success) {
      res.status(200).json({
        message: "Email verified successfully",
        user: verificationResult.user.getSummary(),
        token: verificationResult.token,
      });
    } else {
      res.status(400).json({ message: "Invalid or expired verification code" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
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
    if (error.message === "BANNED" || error.message === "SUSPENDED") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
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
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    // Handle profile picture
    if (updates.profilePicture) {
      if (updates.profilePicture.data) {
        updates.profilePicture = updates.profilePicture;
      }
    }

    // Handle government document
    if (updates.govtDocument?.documentImage) {
      if (updates.govtDocument.documentImage.data) {
        updates.govtDocument.documentImage = {
          data: Buffer.from(updates.govtDocument.documentImage.data),
          contentType:
            updates.govtDocument.documentImage.contentType || "image/jpeg",
        };
      }
    }

    const updatedUser = await userService.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser.getSummary());
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
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

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.resendOTP(email);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resending OTP", error: error.message });
  }
});

// Add change password route
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    const result = await userService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

// Move the favourites route before the :userId route to prevent path conflicts
router.get("/my-favourites", authMiddleware, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favourites);
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.getSummary());
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// Add favorites route
router.put("/add-favorite", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userService.addFavourite(req.user.id, itemId);

    res.status(200).json({ message: "Favorite added successfully" });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete-favorite", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userService.deleteFavourite(req.user.id, itemId);

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get("/favourites", authMiddleware, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favourites);
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

// User
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.getUserSummary());
  } catch (error) {
    console.error(`Error in ${req.originalUrl} -`, error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get user's listed items
router.get("/:userId/items", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const items = await itemService.getItemsBySellerId(userId);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching user's items:", error);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
});

module.exports = router;
