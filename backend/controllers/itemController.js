const Item = require("../models/Item"); // Import the Item model

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      visibility_status,
      location,
    } = req.body;

    // Create a new instance of Item and save it
    const newItem = new Item({
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      visibility_status,
      location,
      createdAt: new Date(),
    });

    await newItem.save();

    res.status(201).json({
      message: "Item created successfully!",
      item: newItem,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching item", error: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedData = req.body;

    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully!",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating item", error: error.message });
  }
};

// Delete item by ID
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({
      message: "Item deleted successfully!",
      item: deletedItem,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
};
