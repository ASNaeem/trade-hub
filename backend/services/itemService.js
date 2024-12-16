const Item = require('../models/itemSchema');  // Mongoose model for Item
const ItemClass = require('../classes/Item');  // Traditional class-based Item

const ItemService = {
  // Create Item
  async createItem(itemData) {
    try {
      
      // Optionally, you can validate data using ItemClass before saving to MongoDB
      const item = new ItemClass(itemData);
      // If ItemClass has validation methods, call them here

      // Mongoose Model save (MongoDB will handle _id automatically)
      const itemDoc = new Item(itemData);
      await itemDoc.save();
      return itemDoc;  // Return the saved item document (with _id from MongoDB)
    } catch (error) {
      throw new Error(`Error creating item: ${error.message}`);
    }
  },

  // Get all items with filtering and sorting combined in one query
  async getAllItems(filters = {}, sort = {}) {
    try {
      // Combine filtering and sorting logic
      let query = this.buildFilterQuery(filters);  // Build filter query without visibility_status
      let sortQuery = this.buildSortQuery(sort);

      // Fetch items from MongoDB with filtering and sorting
      const items = await Item.find(query).sort(sortQuery);
      return items;
    } catch (error) {
      throw new Error(`Error fetching items: ${error.message}`);
    }
  },

  // Get an item by ID
  async getItemById(itemId) {
    try {
       const item = await Item.findById(itemId);
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    } catch (error) {
      throw new Error(`Error fetching item by ID: ${error.message}`);
    }
  },

  // Update an existing item by ID
  async updateItem(itemId, updateData) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      // Apply updates (optional validation using ItemClass)
      const updatedItem = new ItemClass(updateData);

      // Update the item in the database using Mongoose
      await Item.findByIdAndUpdate(itemId, updateData, { new: true });

      return await Item.findById(itemId);
    } catch (error) {
      throw new Error(`Error updating item: ${error.message}`);
    }
  },

  // Delete an item by ID
  async deleteItem(itemId) {
    try {
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      await Item.findByIdAndDelete(itemId);
      return { message: 'Item deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting item: ${error.message}`);
    }
  },

  // Helper method to build filter query (without visibility_status)
  buildFilterQuery(filters) {
    let query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.condition) {
      query.condition = filters.condition;
    }

    if (filters.location) {
      query.location = filters.location;
    }

    return query;  // Return query without visibility_status filter
  },

  // Helper method to build sort query
  buildSortQuery(sortOptions) {
    let sortQuery = {};

    if (sortOptions.price) {
      sortQuery.price = sortOptions.price === 'asc' ? 1 : -1;
    } else if (sortOptions.condition) {
      sortQuery.condition = sortOptions.condition === 'asc' ? 1 : -1;
    } else if (sortOptions.createdAt) {
      sortQuery.created_at = sortOptions.createdAt === 'asc' ? 1 : -1;
    } else {
      sortQuery.created_at = -1;  // Default: sort by creation date descending
    }

    return sortQuery;
  },
};

module.exports = ItemService;
