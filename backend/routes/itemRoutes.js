const express = require("express");
const router = express.Router();
const itemService = require("../services/itemService");
const authMiddleware = require("../middleware/authMiddleware");
const sellerCheckMiddleware = require("../middleware/sellerCheckMiddleware");

// Public Routes (No authentication required)
router.get("/", async (req, res) => {
  try {
    // Parse array parameters
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 6,
      category: req.query.category,
      brand: req.query.brand,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    // Handle array parameters
    if (req.query.brands) {
      filters.brands = Array.isArray(req.query.brands)
        ? req.query.brands
        : [req.query.brands];
    }

    if (req.query.locations) {
      filters.locations = Array.isArray(req.query.locations)
        ? req.query.locations
        : [req.query.locations];
    }

    if (req.query.conditions) {
      filters.conditions = Array.isArray(req.query.conditions)
        ? req.query.conditions
        : [req.query.conditions];
    }

    const result = await itemService.getAllItems(filters);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in GET /items:", error);
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
    const newItem = await itemService.createItem(req.body, req.user.id);
    res.status(201).json(newItem);
  } catch (error) {
    if (error.message.includes("Policy violation")) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
});

router.put("/:itemId", authMiddleware, async (req, res) => {
  try {
    const updatedItem = await itemService.updateItem(
      req.params.itemId,
      req.body,
      req.user.id
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes("Policy violation")) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error updating item", error: error.message });
  }
});

router.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    const result = await itemService.deleteItem(req.params.itemId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
});

module.exports = router;
