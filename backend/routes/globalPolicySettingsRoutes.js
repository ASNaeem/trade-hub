const express = require("express");
const router = express.Router();
const globalPolicySettingsService = require("../services/globalPolicySettingsService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Create new policy (admin only)
router.post("/", [authMiddleware, adminAuthMiddleware], async (req, res) => {
  try {
    const { name, value, description } = req.body;
    const policy = await globalPolicySettingsService.createPolicy(
      name,
      value,
      description,
      req.user.id
    );
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all policies
router.get("/", async (req, res) => {
  try {
    const policies = await globalPolicySettingsService.getAllPolicies();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get policy by name
router.get("/:name", async (req, res) => {
  try {
    const policy = await globalPolicySettingsService.getPolicyByName(
      req.params.name
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update policy (admin only)
router.put("/:id", [authMiddleware, adminAuthMiddleware], async (req, res) => {
  try {
    const policy = await globalPolicySettingsService.updatePolicy(
      req.params.id,
      req.body,
      req.user.id
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
