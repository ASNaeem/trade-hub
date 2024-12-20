const Admin = require("../models/adminSchema");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Check if user has role property (should be set by authMiddleware)
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized - Not an admin" });
    }

    // Verify the user is an admin
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Admin not found" });
    }

    // Check if the role matches
    if (admin.role !== req.user.role) {
      return res.status(401).json({ message: "Unauthorized - Role mismatch" });
    }

    // For routes that require superadmin
    if (req.superadminRequired && admin.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Forbidden - Requires superadmin privileges" });
    }

    // Add admin object to request for use in route handlers
    req.admin = admin;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in admin authorization", error: error.message });
  }
};

// Helper middleware for superadmin-only routes
adminAuthMiddleware.superadmin = (req, res, next) => {
  req.superadminRequired = true;
  adminAuthMiddleware(req, res, next);
};

module.exports = adminAuthMiddleware;
