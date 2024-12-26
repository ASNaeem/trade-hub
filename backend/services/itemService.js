const ItemClass = require("../classes/Item");
const ItemModel = require("../models/itemSchema");
const UserModel = require("../models/userSchema");
const globalPolicySettingsService = require("../services/globalPolicySettingsService");

const ItemService = {
  async createItem(itemData, userId) {
    try {
      // Get user to check verification status
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Prepare complete item data
      const completeItemData = {
        ...itemData,
        sellerId: userId,
        price: Number(itemData.price),
      };

      // Enforce policies before creating item
      await globalPolicySettingsService.enforceItemPolicies(
        userId,
        completeItemData,
        user.isVerified
      );

      const itemClassInstance = new ItemClass(
        null,
        itemData.title,
        itemData.description,
        completeItemData.price,
        itemData.brand || null,
        itemData.category,
        itemData.condition,
        itemData.images || [],
        itemData.location,
        userId,
        new Date()
      );

      const itemDocument = new ItemModel({
        title: itemClassInstance.title,
        description: itemClassInstance.description,
        price: itemClassInstance.price,
        brand: itemClassInstance.brand,
        category: itemClassInstance.category,
        condition: itemClassInstance.condition,
        location: itemClassInstance.location,
        images: itemClassInstance.images,
        sellerId: itemClassInstance.sellerId,
        createdAt: itemClassInstance.createdAt,
      });

      const savedItem = await itemDocument.save();
      const itemInstance = new ItemClass(
        savedItem._id,
        savedItem.title,
        savedItem.description,
        savedItem.price,
        savedItem.brand,
        savedItem.category,
        savedItem.condition,
        savedItem.images,
        savedItem.location,
        savedItem.sellerId,
        savedItem.createdAt
      );
      return itemInstance.getSummary();
    } catch (error) {
      throw new Error(`Error creating item: ${error.message}`);
    }
  },

  async getAllItems(filters = {}) {
    try {
      const query = {};

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.brand) {
        query.brand = filters.brand;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = Number(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = Number(filters.maxPrice);
        }
      }

      const items = await ItemModel.find(query).sort({ createdAt: -1 });
      return items.map((item) =>
        new ItemClass(
          item._id,
          item.title,
          item.description,
          item.price,
          item.brand,
          item.category,
          item.condition,
          item.images,
          item.location,
          item.sellerId,
          item.createdAt
        ).getSummary()
      );
    } catch (error) {
      throw new Error(`Error getting items: ${error.message}`);
    }
  },

  async getItemById(itemId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) return null;

      return new ItemClass(
        item._id,
        item.title,
        item.description,
        item.price,
        item.brand,
        item.category,
        item.condition,
        item.images,
        item.location,
        item.sellerId,
        item.createdAt
      ).getSummary();
    } catch (error) {
      throw new Error(`Error getting item: ${error.message}`);
    }
  },

  async updateItem(itemId, updates, userId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) {
        throw new Error("Item not found");
      }

      // Check if user is the seller
      if (item.sellerId.toString() !== userId.toString()) {
        const error = new Error("Not authorized to update this item");
        error.statusCode = 403;
        throw error;
      }

      // Get user to check verification status
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If price is being updated, enforce price-related policies
      if (updates.price !== undefined) {
        await globalPolicySettingsService.enforceItemPolicies(
          userId,
          {
            ...item.toObject(),
            ...updates,
            price: Number(updates.price),
          },
          user.isVerified
        );
      }

      const updatedItem = await ItemModel.findByIdAndUpdate(
        itemId,
        { $set: updates },
        { new: true }
      );

      return new ItemClass(
        updatedItem._id,
        updatedItem.title,
        updatedItem.description,
        updatedItem.price,
        updatedItem.brand,
        updatedItem.category,
        updatedItem.condition,
        updatedItem.images,
        updatedItem.location,
        updatedItem.sellerId,
        updatedItem.createdAt
      ).getSummary();
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error updating item: ${error.message}`);
    }
  },

  async deleteItem(itemId, userId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) {
        return { success: true, message: "Item deleted successfully" };
      }

      // Check if user is the seller
      if (item.sellerId.toString() !== userId.toString()) {
        const error = new Error("Not authorized to delete this item");
        error.statusCode = 403;
        throw error;
      }

      await ItemModel.findByIdAndDelete(itemId);
      return { success: true, message: "Item deleted successfully" };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error deleting item: ${error.message}`);
    }
  },
};

module.exports = ItemService;
