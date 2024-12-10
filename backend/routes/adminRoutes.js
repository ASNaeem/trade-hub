const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// GET route to fetch Admin by email
router.get("/:email", async (req, res) => {
  try {
    const admin = await Admin.load(req.params.email); // Load admin by email using the load method in Admin class
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin", error: error.message });
  }
});

// Export the routes
module.exports = router;
