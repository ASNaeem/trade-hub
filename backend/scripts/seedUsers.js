const mongoose = require("mongoose");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();

const DEMO_USERS = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    password: "demo123", // Will be hashed
    city: "New York",
    isEmailVerified: true,
    isDocumentVerified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    password: "demo123", // Will be hashed
    city: "Los Angeles",
    isEmailVerified: true,
    isDocumentVerified: true,
  },
  {
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "+1122334455",
    password: "demo123", // Will be hashed
    city: "Chicago",
    isEmailVerified: true,
    isDocumentVerified: true,
  },
];

async function seedUsers() {
  let connection;
  try {
    // Connect to MongoDB using the same database name as in .env
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";
    connection = await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash passwords and insert users
    const saltRounds = 10;
    const insertedUsers = [];

    for (const user of DEMO_USERS) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const newUser = new User({
          ...user,
          password: hashedPassword,
        });
        const savedUser = await newUser.save();
        insertedUsers.push(savedUser);
      } catch (err) {
        console.error(`Error inserting user ${user.name}:`, err.message);
      }
    }

    console.log(`Successfully seeded ${insertedUsers.length} users`);
    console.log("\nDemo Users (save these IDs for reference):");
    insertedUsers.forEach((user) => {
      console.log(`${user.name}: ${user._id}`);
    });

    // Return the user IDs for use in other scripts
    return insertedUsers.map((user) => user._id);
  } catch (error) {
    console.error("Error seeding users:", error);
    return [];
  } finally {
    if (connection) {
      await mongoose.connection.close();
      console.log("Database connection closed");
    }
  }
}

// If this script is run directly, execute the seeder
if (require.main === module) {
  seedUsers();
} else {
  // If imported as a module, export the function
  module.exports = seedUsers;
}
