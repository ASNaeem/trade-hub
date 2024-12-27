const mongoose = require("mongoose");
const app = require("../app");

const TEST_MONGODB_URI = "mongodb://localhost:27017/tradehub_test";

const setupTestDB = async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to test database:", error);
    throw error;
  }
};

const teardownTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error cleaning up test database:", error);
    throw error;
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  app,
};
