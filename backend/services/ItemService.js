const axios = require("axios");
const Item = require("./Item"); // Import the class

const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:5000/api/items";

class ItemService {
  static async save(item) {
    try {
      if (!(item instanceof Item)) {
        throw new Error("Invalid item object.");
      }
      const errors = item.validate();
      if (errors) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }

      const response = await axios.post(API_BASE_URL, {
        item_id: item._item_id,
        title: item.title,
        description: item.description,
        price: item.price,
        brand: item.brand,
        category: item.category,
        condition: item.condition,
        images: item.images,
        visibility_status: item.visibilityStatus,
        created_at: item.createdAt,
        location: item.location,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving item:", error.message);
      throw error;
    }
  }

  static async load(item_id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${item_id}`);
      const data = response.data;
      return new Item(
        data.item_id,
        data.title,
        data.description,
        data.price,
        data.brand,
        data.category,
        data.condition,
        data.images,
        data.visibility_status,
        new Date(data.created_at),
        data.location
      );
    } catch (error) {
      console.error("Error loading item:", error.message);
      throw error;
    }
  }

  static async remove(item_id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${item_id}`);
      return response.data;
    } catch (error) {
      console.error("Error removing item:", error.message);
      throw error;
    }
  }

  static async update(item) {
    try {
      if (!(item instanceof Item)) {
        throw new Error("Invalid item object.");
      }
      const errors = item.validate();
      if (errors) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }

      const response = await axios.put(`${API_BASE_URL}/${item._item_id}`, {
        title: item.title,
        description: item.description,
        price: item.price,
        brand: item.brand,
        category: item.category,
        condition: item.condition,
        images: item.images,
        visibility_status: item.visibilityStatus,
        location: item.location,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error.message);
      throw error;
    }
  }
  static async getAll() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error getting all items:", error.message);
      throw error;
    }
  }
  static async getByCategory(category) {
    try {
      const response = await axios.get(`${API_BASE_URL}?category=${category}`);
      return response.data;
    } catch (error) {
      console.error("Error getting items by category:", error.message);
      throw error;
    }
  }
}

module.exports = ItemService;
