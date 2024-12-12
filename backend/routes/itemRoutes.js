const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
//const { verifyToken } = require("../middleware/auth");

// Route to create a new item
//router.post("/", verifyToken, itemController.createItem);
router.post("/", itemController.createItem);
// Route to get all items with optional filters (e.g., query params for filtering)
router.get("/", itemController.getItems);

// Route to get a single item by ID
router.get("/:itemId", itemController.getItemById);

// Route to update an item
router.put("/:itemId", itemController.updateItem);
//router.put("/:itemId", verifyToken, itemController.updateItem);
// Route to delete an item
//router.delete("/:itemId", verifyToken, itemController.deleteItem);
router.delete("/:itemId", itemController.deleteItem);

module.exports = router;
