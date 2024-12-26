const mongoose = require("mongoose");

const setupTestDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tradehub-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Clear all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
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

module.exports = {
  setupTestDB,
  teardownTestDB,
};
