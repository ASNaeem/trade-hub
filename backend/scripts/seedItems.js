const mongoose = require("mongoose");
const Item = require("../models/itemSchema");
const seedUsers = require("./seedUsers");
require("dotenv").config();

async function createDemoItems(userIds) {
  // Define image collections for each category
  const categoryImages = {
    clothing: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2",
    ],
    accessories: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
      "https://images.unsplash.com/photo-1509941943102-10c232535736",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8",
    ],
    electronics: {
      console: [
        "https://images.unsplash.com/photo-1486401899868-0e435ed85128",
        "https://images.unsplash.com/photo-1605901309584-818e25960a8f",
        "https://images.unsplash.com/photo-1625645758520-69e4db363b8f",
        "https://images.unsplash.com/photo-1604586362304-e75dda43b915",
      ],
      phone: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2",
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e",
      ],
      laptop: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        "https://images.unsplash.com/photo-1504707748692-419802cf939d",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        "https://images.unsplash.com/photo-1504707748692-419802cf939d",
      ],
    },
  };

  // Helper function to get images for a category and subcategory
  const getImages = (category, subcategory = null) => {
    let imageUrls;
    if (category === "Electronics") {
      imageUrls = categoryImages.electronics[subcategory.toLowerCase()];
    } else if (category === "Clothing") {
      imageUrls = categoryImages.clothing;
    } else {
      imageUrls = categoryImages.accessories;
    }

    return imageUrls.map((url) => ({
      type: "url",
      url: `${url}?auto=format&fit=crop&q=80&w=500`,
    }));
  };

  // Helper function to generate price variation
  const generatePriceVariation = (basePrice) => {
    // Generate a random variation between -10% and +10%
    const variationPercent = Math.random() * 20 - 10; // -10 to +10
    const variation = basePrice * (variationPercent / 100);
    return Number((basePrice + variation).toFixed(2));
  };

  // Base prices for each category
  const basePrices = {
    "Vintage Leather Jacket": 129.99,
    "Designer Watch": 299.99,
    "Gaming Console": 399.99,
    Smartphone: 599.99,
    Laptop: 999.99,
  };

  // Helper function to generate condition-based price adjustment
  const getConditionAdjustedPrice = (basePrice, condition) => {
    let price = generatePriceVariation(basePrice);
    switch (condition) {
      case "New":
        return price;
      case "Used":
        return Number((price * 0.7).toFixed(2)); // 30% less for used
      case "Refurbished":
        return Number((price * 0.85).toFixed(2)); // 15% less for refurbished
      default:
        return price;
    }
  };

  return Array.from({ length: 20 }, (_, index) => {
    const categories = [
      "Clothing",
      "Accessories",
      "Electronics",
      "Electronics",
      "Electronics",
    ];
    const subcategories = [null, null, "console", "phone", "laptop"];
    const categoryIndex = index % 5;
    const title = [
      "Vintage Leather Jacket",
      "Designer Watch",
      "Gaming Console",
      "Smartphone",
      "Laptop",
    ][categoryIndex];
    const condition = ["New", "Used", "Refurbished"][index % 3];

    return {
      title,
      description: [
        "Classic vintage leather jacket in excellent condition. Perfect for any season.",
        "Elegant designer watch with premium features and timeless design.",
        "Latest gaming console with two controllers and popular games included.",
        "Latest model smartphone with all accessories and original packaging.",
        "High-performance laptop perfect for work and gaming.",
      ][categoryIndex],
      price: getConditionAdjustedPrice(basePrices[title], condition),
      brand: ["Levi's", "Fossil", "Sony", "Apple", "Dell"][categoryIndex],
      category: categories[categoryIndex],
      condition,
      location: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"][
        index % 5
      ],
      images: getImages(
        categories[categoryIndex],
        subcategories[categoryIndex]
      ),
      sellerId: userIds[index % userIds.length],
    };
  });
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
