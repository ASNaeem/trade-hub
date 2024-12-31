require("dotenv").config({ path: "backend/.env" });

module.exports = {
  PORT: 5001,
  MONGODB_URI:
    process.env.TEST_DB_URI || "mongodb://localhost:27017/tradehub_test",
  JWT_SECRET: process.env.JWT_SECRET || "test-secret-key",
  ENV: "test",
};
