const express = require("express");
const router = express.Router();
const disputeService = require("../services/disputeService");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Create new dispute
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemId, sellerId, reason } = req.body;
    const dispute = await disputeService.createDispute(
      itemId,
      req.user.id, // buyerId from authenticated user
      sellerId,
      reason
    );
    res.status(201).json(dispute);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating dispute", error: error.message });
  }
});

// Get all disputes (admin only)
router.get("/all", [authMiddleware, adminAuthMiddleware], async (req, res) => {
  try {
    const disputes = await disputeService.getAllDisputes();
    res.status(200).json(disputes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching disputes", error: error.message });
  }
});

// Get user's disputes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const disputes = await disputeService.getDisputesByUser(req.user.id);
    res.status(200).json(disputes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching disputes", error: error.message });
  }
});

// Update dispute status (admin only)
router.patch(
  "/:disputeId/status",
  [authMiddleware, adminAuthMiddleware],
  async (req, res) => {
    try {
      const { status } = req.body;
      const dispute = await disputeService.updateDisputeStatus(
        req.params.disputeId,
        status
      );
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      res.status(200).json(dispute);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error updating dispute status",
          error: error.message,
        });
    }
  }
);

module.exports = router;
