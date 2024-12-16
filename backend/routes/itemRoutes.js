const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerCheckMiddleware = require("../middleware/sellerCheckMiddleware");

// Public Routes (No authentication required)
router.get("/", itemController.getAllItems);  // List all items
router.get("/:itemId", itemController.getItemById);  // Get item by ID

// Private Routes (Authentication required)
router.post("/", authMiddleware, itemController.createItem);  // Create new item (auth required)
router.put("/:itemId", authMiddleware, sellerCheckMiddleware, itemController.updateItem);  // Edit item (auth + seller check)
router.delete("/:itemId", authMiddleware, sellerCheckMiddleware, itemController.deleteItem);  // Delete item (auth + seller check)

module.exports = router;
