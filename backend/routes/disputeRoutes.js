const express = require("express");
const router = express.Router();
const disputeService = require("../services/disputeService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Report content
router.post("/report", authMiddleware, async (req, res) => {
  try {
    const { reportType, contentId, reason, description } = req.body;

    // Validate required fields
    if (!reportType || !contentId || !reason) {
      return res.status(400).json({
        message: "reportType, contentId, and reason are required fields",
      });
    }

    // Validate report type
    const validReportTypes = ["message", "item", "user"];
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({
        message: `Invalid report type. Must be one of: ${validReportTypes.join(
          ", "
        )}`,
      });
    }

    // Validate reason
    const validReasons = [
      "inappropriate",
      "spam",
      "fraud",
      "harassment",
      "other",
    ];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        message: `Invalid reason. Must be one of: ${validReasons.join(", ")}`,
      });
    }

    const dispute = await disputeService.reportContent(
      reportType,
      contentId,
      req.user.id,
      reason,
      description
    );
    res.status(201).json(dispute);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.message.includes("already reported")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("reached the report threshold")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get user's disputes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const disputes = await disputeService.getUserDisputes(req.user.id);
    res.status(200).json(disputes);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Resolve dispute (admin only)
router.put(
  "/:disputeId/resolve",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { resolution, notes } = req.body;

      // Validate required fields
      if (!resolution) {
        return res.status(400).json({
          message: "resolution is a required field",
        });
      }

      // Validate resolution
      const validResolutions = ["warning", "delete", "ban", "no_action"];
      if (!validResolutions.includes(resolution)) {
        return res.status(400).json({
          message: `Invalid resolution. Must be one of: ${validResolutions.join(
            ", "
          )}`,
        });
      }

      const dispute = await disputeService.resolveDispute(
        req.params.disputeId,
        req.user.id,
        resolution,
        notes
      );
      res.status(200).json(dispute);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      if (error.message.includes("Dispute not found")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("Not authorized")) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
