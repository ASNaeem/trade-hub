const mongoose = require("mongoose");
const { app } = require("../server");
require("dotenv").config({ path: "backend/.env" });

const TEST_MONGODB_URI =
  process.env.TEST_DB_URI || "mongodb://localhost:27017/tradehub_test";

const startTestServer = async () => {
  try {
    await mongoose.disconnect(); // Ensure no existing connections
    await mongoose.connect(TEST_MONGODB_URI);
    const server = app.listen(5001); // Use a different port for tests
    return server;
  } catch (error) {
    console.error("Error starting test server:", error);
    throw error;
  }
};

const stopTestServer = async (server) => {
  try {
    await mongoose.connection.dropDatabase(); // Clean up test database
    await mongoose.disconnect();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error("Error stopping test server:", error);
    throw error;
  }
};

module.exports = {
  startTestServer,
  stopTestServer,
  TEST_MONGODB_URI,
};
