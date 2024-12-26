const mongoose = require("mongoose");
const Item = require("../models/itemSchema");
const seedUsers = require("./seedUsers");
require("dotenv").config();

async function createDemoItems(userIds) {
  return Array.from({ length: 20 }, (_, index) => ({
    title: [
      "Vintage Leather Jacket",
      "Designer Watch",
      "Gaming Console",
      "Smartphone",
      "Laptop",
    ][index % 5],
    description: [
      "Classic vintage leather jacket in excellent condition. Perfect for any season.",
      "Elegant designer watch with premium features and timeless design.",
      "Latest gaming console with two controllers and popular games included.",
      "Latest model smartphone with all accessories and original packaging.",
      "High-performance laptop perfect for work and gaming.",
    ][index % 5],
    price: [129.99, 299.99, 399.99, 599.99, 999.99][index % 5],
    brand: ["Levi's", "Fossil", "Sony", "Apple", "Dell"][index % 5],
    category: [
      "Clothing",
      "Accessories",
      "Electronics",
      "Electronics",
      "Electronics",
    ][index % 5],
    condition: ["New", "Used", "Refurbished"][index % 3],
    location: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"][
      index % 5
    ],
    images: [
      {
        type: "url",
        url:
          [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5",
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
            "https://images.unsplash.com/photo-1486401899868-0e435ed85128",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
          ][index % 5] + "?auto=format&fit=crop&q=80&w=500",
      },
    ],
    // Distribute items among the demo users
    sellerId: userIds[index % userIds.length],
  }));
}

async function seedItems() {
  let connection;
  try {
    // First seed users and get their IDs
    console.log("Creating demo users...");
    const userIds = await seedUsers();

    if (userIds.length === 0) {
      throw new Error("Failed to create demo users");
    }

    // Connect to MongoDB using the same database name as in .env
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";
    connection = await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);

    // Clear existing items
    await Item.deleteMany({});
    console.log("Cleared existing items");

    // Create demo items with real user IDs
    const DEMO_ITEMS = await createDemoItems(userIds);

    // Insert items one by one to better handle errors
    const insertedItems = [];
    for (const item of DEMO_ITEMS) {
      try {
        const newItem = new Item(item);
        const savedItem = await newItem.save();
        insertedItems.push(savedItem);
      } catch (err) {
        console.error(`Error inserting item ${item.title}:`, err.message);
      }
    }

    console.log(`Successfully seeded ${insertedItems.length} items`);
    console.log("\nSample item IDs (save these for reference):");
    insertedItems.slice(0, 5).forEach((item) => {
      console.log(`${item.title}: ${item._id} (Seller: ${item.sellerId})`);
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    // Close the connection
    if (connection) {
      await mongoose.connection.close();
      console.log("Database connection closed");
    }
  }
}

// Run the seeder
seedItems();
