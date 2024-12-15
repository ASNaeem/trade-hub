const itemService = require("../services/itemService");
const itemSchema = require("../models/itemSchema.js");
// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, brand, category, condition, images, location } = req.body;
    const sellerId = req.user.id; // Extract user ID from the authenticated request

    const item = await itemService.createItem(
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      location,
      sellerId
    );

    res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    console.error(`Error in /api/items -`, error.message);
    res.status(500).json({ message: "Error creating item" });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const filters = req.query; // Use query params for filters
    const items = await itemService.getAllItems(filters);

    res.status(200).json(items);
  } catch (error) {
    console.error(`Error in /api/items -`, error.message);
    res.status(500).json({ message: "Error fetching items" });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await itemService.getItemById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(`Error in /api/items/${req.params.itemId} -`, error.message);
    res.status(500).json({ message: "Error fetching item" });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    const sellerId = req.user.id;

    const updatedItem = await itemService.updateItem(itemId, updates, sellerId);

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error(`Error in /api/items/${req.params.itemId} -`, error.message);
    res.status(500).json({ message: "Error updating item" });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const sellerId = req.user.id;

    const deleted = await itemService.deleteItem(itemId, sellerId);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(`Error in /api/items/${req.params.itemId} -`, error.message);
    res.status(500).json({ message: "Error deleting item" });
  }
};
