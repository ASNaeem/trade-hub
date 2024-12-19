const itemService = require("../services/itemService");
const mongoose = require("mongoose");

async function createItem(req, res) {
  try {
    const {
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      visibilityStatus, // For the seller to choose visibility
      location,
      sellerId,
    } = req.body;

    // Validate required fields (you can improve this with better validation if needed)
    if (!title || !price || !category || !condition || !location || !sellerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create item via itemService (pass req.body as a single object)
    const newItem = await itemService.createItem({
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      location,
      sellerId,
      visibilityStatus, // This stays with the item as per the seller's choice
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating item" });
  }
}

// Controller function to get all items (no longer filter by visibilityStatus)
async function getAllItems(req, res) {
  try {
    // Get filters and sort options from query params (optional)
    const filters = req.query; // You can pass the entire query as filters
    const sortOptions = req.query.sort ? JSON.parse(req.query.sort) : {}; // If sort is passed in query

    // Fetch all items with possible filtering and sorting
    const items = await itemService.getAllItems(filters, sortOptions);

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve items" });
  }
}

async function getItemById(req, res) {
  try {
    const { itemId } = req.params;

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    // Fetch item by ID
    const item = await itemService.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching item" });
  }
}

async function updateItem(req, res) {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    // Update item via itemService
    const updatedItem = await itemService.updateItem(itemId, updates);
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating item" });
  }
}

async function deleteItem(req, res) {
  try {
    const { itemId } = req.params;

    // Delete item via itemService
    const result = await itemService.deleteItem(itemId);
    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting item" });
  }
}

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
