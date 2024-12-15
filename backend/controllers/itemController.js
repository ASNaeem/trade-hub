const itemService = require("../services/itemService");

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
      visibilityStatus,
      location,
      sellerId,
    } = req.body;

    // Validate required fields (you can improve this with better validation if needed)
    if (!title || !price || !category || !condition || !location || !sellerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create item via itemService
    const newItem = await itemService.createItem(
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      visibilityStatus,
      location,
      sellerId
    );

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating item" });
  }
}

async function getItemById(req, res) {
  try {
    const { itemId } = req.params;

    // Fetch item by ID
    const item = await itemService.findItemById(itemId);
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
  getItemById,
  updateItem,
  deleteItem,
};
