const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const ItemService = require("../services/ItemService");

// POST route to create a new Item
router.post("/", async (req, res) => {
  try {
    const {
      item_id,
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
    const item = new Item(
      item_id,
      title,
      description,
      price,
      brand,
      category,
      condition,
      images,
      visibility_status,
      new Date(),
      location
    );
    await item.save(); // Save item using save method in Item class
    res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
});

// GET route to fetch an Item by ID
router.get("/:item_id", async (req, res) => {
  try {
    const item = await Item.load(req.params.item_id); // Load item by ID using load method in Item class
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

// PUT route to update an Item by ID
router.put("/:item_id", async (req, res) => {
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
    const item = await Item.load(req.params.item_id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item._title = title || item._title;
    item._description = description || item._description;
    item._price = price || item._price;
    item._brand = brand || item._brand;
    item._category = category || item._category;
    item._condition = condition || item._condition;
    item._images = images || item._images;
    item._visibility_status = visibility_status || item._visibility_status;
    item._location = location || item._location;
    await item.update(); // Update item using the update method in Item class
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating item", error: error.message });
  }
});

// DELETE route to remove an Item by ID
router.delete("/:item_id", async (req, res) => {
  try {
    await Item.remove(req.params.item_id); // Remove item using remove method in Item class
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
});

// Export the routes
module.exports = router;
