const mongoose = require("mongoose");
const { app } = require("../server");
const testConfig = require("../config/test.config");

const startTestServer = async () => {
  global.__MONGO_URI__ = testConfig.MONGODB_URI;

  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Connect with updated settings
    await mongoose.connect(global.__MONGO_URI__, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    // Drop database to ensure clean state
    await mongoose.connection.dropDatabase();

    console.log(`Connected to test database: ${global.__MONGO_URI__}`);
    const server = app.listen(0); // Use port 0 for random test port
    return server;
  } catch (error) {
    console.error("Failed to start test server:", error);
    throw error;
  }
};

const stopTestServer = async (server) => {
  if (!server) {
    throw new Error("No server instance provided to stopTestServer");
  }

  try {
    // Drop database before closing connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await new Promise((resolve) => server.close(resolve));
    delete global.__MONGO_URI__;
  } catch (error) {
    console.error("Error stopping test server:", error);
    throw error;
  }
};

module.exports = { startTestServer, stopTestServer };
