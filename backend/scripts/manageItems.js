const mongoose = require("mongoose");
const ItemModel = require("../models/itemSchema");
require("dotenv").config();

// Use main database URI instead of test database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB:", MONGODB_URI))
  .catch((err) => console.error("MongoDB connection error:", err));

// List all items with optional filters
const listItems = async (filters = {}) => {
  try {
    const query = {};

    // Apply filters if provided
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = filters.brand;
    if (filters.condition) query.condition = filters.condition;
    if (filters.minPrice) query.price = { $gte: parseFloat(filters.minPrice) };
    if (filters.maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(filters.maxPrice) };
    }

    const items = await ItemModel.find(query).populate(
      "sellerId",
      "name email"
    );
    console.log("\nTotal items:", items.length);
    items.forEach((item) => {
      console.log(`\nID: ${item._id}`);
      console.log(`Title: ${item.title}`);
      console.log(`Category: ${item.category}`);
      console.log(`Brand: ${item.brand || "N/A"}`);
      console.log(`Price: $${item.price}`);
      console.log(`Condition: ${item.condition}`);
      console.log(`Location: ${item.location}`);
      console.log(`Seller: ${item.sellerId.name} (${item.sellerId.email})`);
      console.log(`Images: ${item.images.length}`);
      console.log(`Created: ${item.createdAt}`);
      console.log("------------------------");
    });
  } catch (error) {
    console.error("Error listing items:", error);
  }
};

// Delete an item by ID
const deleteItemById = async (itemId) => {
  try {
    const result = await ItemModel.findByIdAndDelete(itemId);
    if (result) {
      console.log(`Item with ID ${itemId} deleted successfully`);
    } else {
      console.log(`No item found with ID ${itemId}`);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

// Delete items by filter
const deleteItemsByFilter = async (filters = {}) => {
  try {
    const query = {};

    // Apply filters
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = filters.brand;
    if (filters.condition) query.condition = filters.condition;

    const result = await ItemModel.deleteMany(query);
    console.log(`${result.deletedCount} items deleted successfully`);
  } catch (error) {
    console.error("Error deleting items:", error);
  }
};

// Delete all items
const deleteAllItems = async () => {
  try {
    const result = await ItemModel.deleteMany({});
    console.log(`${result.deletedCount} items deleted successfully`);
  } catch (error) {
    console.error("Error deleting items:", error);
  }
};

// Get item statistics
const getItemStats = async () => {
  try {
    const totalItems = await ItemModel.countDocuments();

    // Get counts by category
    const categoryCounts = await ItemModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Get counts by condition
    const conditionCounts = await ItemModel.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
    ]);

    // Get price statistics
    const priceStats = await ItemModel.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    console.log("\nItem Statistics:");
    console.log(`Total Items: ${totalItems}`);

    console.log("\nBy Category:");
    categoryCounts.forEach((cat) => {
      console.log(`${cat._id}: ${cat.count}`);
    });

    console.log("\nBy Condition:");
    conditionCounts.forEach((cond) => {
      console.log(`${cond._id}: ${cond.count}`);
    });

    if (priceStats.length > 0) {
      console.log("\nPrice Statistics:");
      console.log(`Average Price: $${priceStats[0].avgPrice.toFixed(2)}`);
      console.log(`Minimum Price: $${priceStats[0].minPrice.toFixed(2)}`);
      console.log(`Maximum Price: $${priceStats[0].maxPrice.toFixed(2)}`);
    }
  } catch (error) {
    console.error("Error getting item statistics:", error);
  }
};

// Export functions for command line use
module.exports = {
  listItems,
  deleteItemById,
  deleteItemsByFilter,
  deleteAllItems,
  getItemStats,
};

// Helper function to parse command line filters
const parseFilters = (args) => {
  const filters = {};
  for (let i = 3; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];
    if (value) filters[key] = value;
  }
  return filters;
};

// If running directly from command line
if (require.main === module) {
  const command = process.argv[2];
  const filters = parseFilters(process.argv);

  switch (command) {
    case "list":
      listItems(filters).then(() => mongoose.disconnect());
      break;
    case "delete":
      if (process.argv[3]) {
        deleteItemById(process.argv[3]).then(() => mongoose.disconnect());
      } else {
        console.error("Please provide an item ID to delete");
        mongoose.disconnect();
      }
      break;
    case "deleteByFilter":
      deleteItemsByFilter(filters).then(() => mongoose.disconnect());
      break;
    case "deleteAll":
      deleteAllItems().then(() => mongoose.disconnect());
      break;
    case "stats":
      getItemStats().then(() => mongoose.disconnect());
      break;
    default:
      console.log("Available commands:");
      console.log(
        "- node manageItems.js list [--category <category>] [--brand <brand>] [--condition <condition>] [--minPrice <price>] [--maxPrice <price>]"
      );
      console.log("- node manageItems.js delete <itemId>");
      console.log(
        "- node manageItems.js deleteByFilter [--category <category>] [--brand <brand>] [--condition <condition>]"
      );
      console.log("- node manageItems.js deleteAll");
      console.log("- node manageItems.js stats");
      mongoose.disconnect();
  }
}
