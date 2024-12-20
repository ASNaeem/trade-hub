const express = require("express");
const router = express.Router();
const itemService = require("../services/itemService");
const authMiddleware = require("../middleware/authMiddleware");
const sellerCheckMiddleware = require("../middleware/sellerCheckMiddleware");

// Public Routes (No authentication required)
router.get("/", async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
});

router.get("/:itemId", async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching item", error: error.message });
  }
});

// Private Routes (Authentication required)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
});

router.put(
  "/:itemId",
  authMiddleware,
  sellerCheckMiddleware,
  async (req, res) => {
    try {
      const updatedItem = await itemService.updateItem(
        req.params.itemId,
        req.body
      );
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating item", error: error.message });
    }
  }
);

router.delete(
  "/:itemId",
  authMiddleware,
  sellerCheckMiddleware,
  async (req, res) => {
    try {
      const deletedItem = await itemService.deleteItem(req.params.itemId);
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting item", error: error.message });
    }
  }
);

module.exports = router;
