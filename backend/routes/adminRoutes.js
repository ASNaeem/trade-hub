const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

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
    const { email, password } = req.body;
    const { admin, token } = await adminService.authenticateAdmin(
      email,
      password
    );
    res.status(200).json({
      token,
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get admin profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin.getSummary());
  } catch (error) {
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

module.exports = router;
