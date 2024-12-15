const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");

// Validation middleware for creating/updating items
const validateItem = [
  check("title").notEmpty().withMessage("Title is required"),
  check("price").isNumeric().withMessage("Price must be a valid number"),
  check("category").notEmpty().withMessage("Category is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to create a new item
router.post("/", authMiddleware, validateItem, itemController.createItem);

// Route to get all items with optional filters (e.g., query params for filtering)
router.get("/", itemController.getItems);

// Route to get a single item by ID
router.get("/:itemId", itemController.getItemById);

// Route to update an item
router.put("/:itemId", authMiddleware, validateItem, itemController.updateItem);

// Route to delete an item
router.delete("/:itemId", authMiddleware, itemController.deleteItem);

module.exports = router;
