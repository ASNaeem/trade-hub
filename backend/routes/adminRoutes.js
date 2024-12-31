const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const User = require("../models/userSchema");

// Admin registration (protected, only super admins can create new admins)
router.post(
  "/register",
  [authMiddleware, adminAuthMiddleware.superadmin],
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const admin = await adminService.createAdmin(name, email, password, role);
      const { token } = await adminService.authenticateAdmin(email, password);
      res.status(201).json({
        token,
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin login
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt for admin:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing credentials");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { admin, token, role } = await adminService.authenticateAdmin(
      email,
      password
    );

    console.log("Login successful for admin:", email);
    res.status(200).json({
      token,
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: role,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message || "Invalid credentials" });
  }
});

// Get all users
router.get(
  "/users",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get admin profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Getting admin profile for ID:", req.user.id);
    const admin = await adminService.getAdminById(req.user.id);
    console.log("Found admin:", admin);

    if (!admin) {
      console.log("Admin not found in database");
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if admin has getSummary method
    console.log("Admin methods:", Object.getOwnPropertyNames(admin.__proto__));

    const summary = admin.getSummary();
    console.log("Admin summary:", summary);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error in profile route:", error);
    res
      .status(500)
      .json({ message: "Error fetching admin profile", error: error.message });
  }
});

// Update admin profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updatedAdmin = await adminService.updateAdmin(req.user.id, req.body);
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin.getSummary(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin profile", error: error.message });
  }
});

// Update user status
router.put(
  "/users/:userId/status",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      // Validate status
      if (!["ban", "suspend", "activate"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const updatedUser = await adminService.updateUserStatus(userId, status);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete user listing
router.delete(
  "/users/:userId/listings/:listingId",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { userId, listingId } = req.params;
      await adminService.deleteUserListing(userId, listingId);
      res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all disputes
router.get(
  "/disputes",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const disputes = await adminService.getAllDisputes();
      res.status(200).json(disputes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Resolve dispute
router.put(
  "/disputes/:disputeId/resolve",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { disputeId } = req.params;
      const { resolution } = req.body;
      const dispute = await adminService.resolveDispute(disputeId, resolution);
      res.status(200).json(dispute);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all policies
router.get(
  "/policies",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const policies = await adminService.getAllPolicies();
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update policy
router.put(
  "/policies/:policyId",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { policyId } = req.params;
      const { value } = req.body;
      const policy = await adminService.updatePolicy(policyId, value);
      res.status(200).json(policy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Document Verification Routes
router.get(
  "/verifications/pending",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const pendingUsers = await User.find({
        "verification.status": "pending",
        "verification.documentPath": { $exists: true },
      }).select("_id name email verification");

      const verifications = pendingUsers.map((user) => ({
        userId: user._id,
        userName: user.name,
        email: user.email,
        documentType: user.verification.documentType,
        documentNumber: user.verification.documentNumber,
        submittedAt: user.verification.submittedAt,
      }));

      res.json(verifications);
    } catch (error) {
      console.error("Error fetching pending verifications:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch pending verifications" });
    }
  }
);

router.get(
  "/users/:userId/document",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user || !user.verification.documentPath) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Send the document file
      res.sendFile(user.verification.documentPath, { root: "./" });
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  }
);

router.put(
  "/users/:userId/verify-document",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { isApproved, reason } = req.body;
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update verification status
      user.verification.status = isApproved ? "approved" : "rejected";
      user.verification.reviewedAt = new Date();
      user.verification.reviewedBy = req.admin._id;
      user.verification.rejectionReason = isApproved ? null : reason;
      user.isDocumentVerified = isApproved;

      await user.save();

      // Send notification to user about verification result
      // This is where you would implement notification logic (email, in-app, etc.)

      res.json({
        message: `Document verification ${
          isApproved ? "approved" : "rejected"
        } successfully`,
        status: user.verification.status,
      });
    } catch (error) {
      console.error("Error updating verification status:", error);
      res.status(500).json({ message: "Failed to update verification status" });
    }
  }
);

module.exports = router;
