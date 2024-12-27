const mongoose = require("mongoose");
const UserModel = require("../models/userSchema");
require("dotenv").config();

// Use main database URI instead of test database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB:", MONGODB_URI))
  .catch((err) => console.error("MongoDB connection error:", err));

// List all users
const listUsers = async () => {
  try {
    const users = await UserModel.find({});
    console.log("\nTotal users:", users.length);
    users.forEach((user) => {
      console.log(`\nID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Phone: ${user.phone}`);
      console.log(
        `Email Verified: ${user.isEmailVerified === true ? "Yes" : "No"}`
      );
      console.log("------------------------");
    });
  } catch (error) {
    console.error("Error listing users:", error);
  }
};

// Delete a user by email
const deleteUserByEmail = async (email) => {
  try {
    const result = await UserModel.findOneAndDelete({ email });
    if (result) {
      console.log(`User with email ${email} deleted successfully`);
    } else {
      console.log(`No user found with email ${email}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Delete all users
const deleteAllUsers = async () => {
  try {
    const result = await UserModel.deleteMany({});
    console.log(`${result.deletedCount} users deleted successfully`);
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

// Export functions for command line use
module.exports = {
  listUsers,
  deleteUserByEmail,
  deleteAllUsers,
};

// If running directly from command line
if (require.main === module) {
  const command = process.argv[2];
  const email = process.argv[3];

  switch (command) {
    case "list":
      listUsers().then(() => mongoose.disconnect());
      break;
    case "delete":
      if (!email) {
        console.error("Please provide an email address to delete");
        mongoose.disconnect();
        break;
      }
      deleteUserByEmail(email).then(() => mongoose.disconnect());
      break;
    case "deleteAll":
      deleteAllUsers().then(() => mongoose.disconnect());
      break;
    default:
      console.log("Available commands:");
      console.log("- node manageUsers.js list");
      console.log("- node manageUsers.js delete <email>");
      console.log("- node manageUsers.js deleteAll");
      mongoose.disconnect();
  }
}
