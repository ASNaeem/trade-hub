const express = require("express");
const router = express.Router();
const messageService = require("../services/messageService");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await messageService.createMessage(
      req.user.id,
      receiverId,
      content
    );
    res.status(201).json(message);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Error sending message" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await messageService.getUserMessages(req.user.id);
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting messages", error: error.message });
  }
});

router.put("/:messageId/read", authMiddleware, async (req, res) => {
  try {
    const message = await messageService.markMessageAsRead(
      req.params.messageId,
      req.user.id
    );
    res.status(200).json(message);
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("unauthorized")) {
      return res.status(403).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error marking message as read", error: error.message });
  }
});

module.exports = router;
