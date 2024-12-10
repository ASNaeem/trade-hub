const axios = require("axios");

class Item {
  constructor(item_id, title, description, price, brand, category, condition, images, visibility_status, created_at = new Date(), location) {
    this._item_id = item_id;
    this._title = title;
    this._description = description;
    this._price = price;
    this._brand = brand;
    this._category = category;
    this._condition = condition;
    this._images = images; // Array of image URLs or paths
    this._visibility_status = visibility_status; // For example: 'visible', 'hidden', etc.
    this._created_at = created_at;
    this._location = location; // Location where the item is located (e.g., city or region)
  }

  // Save Item via API
  async save() {
    try {
      const response = await axios.post("http://localhost:5000/api/items", {
        item_id: this._item_id,
        title: this._title,
        description: this._description,
        price: this._price,
        brand: this._brand,
        category: this._category,
        condition: this._condition,
        images: this._images,
        visibility_status: this._visibility_status,
        created_at: this._created_at,
        location: this._location,
      });
      console.log("Item saved:", response.data);
    } catch (error) {
      console.error("Error saving item:", error.message);
    }
  }

  // Load Item by ID via API
  static async load(item_id) {
    try {
      const response = await axios.get(`http://localhost:5000/api/items/${item_id}`);
      const { item_id: id, title, description, price, brand, category, condition, images, visibility_status, created_at, location } = response.data;
      return new Item(id, title, description, price, brand, category, condition, images, visibility_status, new Date(created_at), location);
    } catch (error) {
      console.error("Error loading item:", error.message);
      return null;
    }
  }

  // Remove Item via API (Delete)
  static async remove(item_id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/items/${item_id}`);
      console.log("Item removed:", response.data);
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  }

  // Update Item (e.g., to modify visibility or price)
  async update() {
    try {
      const response = await axios.put(`http://localhost:5000/api/items/${this._item_id}`, {
        title: this._title,
        description: this._description,
        price: this._price,
        brand: this._brand,
        category: this._category,
        condition: this._condition,
        images: this._images,
        visibility_status: this._visibility_status,
        location: this._location,
      });
      console.log("Item updated:", response.data);
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  }
}

module.exports = Item;
