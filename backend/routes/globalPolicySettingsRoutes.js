const express = require("express");
const router = express.Router();
const globalPolicySettingsService = require("../services/globalPolicySettingsService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Create new policy (admin only)
router.post("/", [authMiddleware, adminAuthMiddleware], async (req, res) => {
  try {
    const { policyName, value, description } = req.body;
    const policy = await globalPolicySettingsService.createPolicy(
      policyName,
      value,
      description,
      req.user.id
    );
    res.status(201).json(policy);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating policy", error: error.message });
  }
});

// Get all policies
router.get("/", async (req, res) => {
  try {
    const policies = await globalPolicySettingsService.getAllPolicies();
    res.status(200).json(policies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching policies", error: error.message });
  }
});

// Get policy by name
router.get("/:policyName", async (req, res) => {
  try {
    const policy = await globalPolicySettingsService.getPolicyByName(
      req.params.policyName
    );
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching policy", error: error.message });
  }
});

// Update policy (admin only)
router.put(
  "/:policyId",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const policy = await globalPolicySettingsService.updatePolicy(
        req.params.policyId,
        req.body,
        req.user.id
      );
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      res.status(200).json(policy);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating policy", error: error.message });
    }
  }
);

module.exports = router;
