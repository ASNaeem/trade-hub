const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Load config based on environment
const config =
  process.env.NODE_ENV === "test"
    ? require("./config/test.config")
    : {
        PORT: process.env.PORT || 5000,
        MONGODB_URI:
          process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub",
        JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
      };

console.log("Starting server with config:", {
  PORT: config.PORT,
  MONGODB_URI: config.MONGODB_URI.split("@")[1] || "local", // Log DB URI without credentials
  ENV: process.env.NODE_ENV || "development",
});

// CORS Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
  });
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const itemRoutes = require("./routes/itemRoutes");
const messageRoutes = require("./routes/messageRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const globalPolicySettingsRoutes = require("./routes/globalPolicySettingsRoutes");

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/policies", globalPolicySettingsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

const startServer = async (config) => {
  try {
    // Only connect to database if not in test environment and no global test URI exists
    if (process.env.NODE_ENV !== "test" && !global.__MONGO_URI__) {
      await mongoose.connect(config.MONGODB_URI);
      console.log(`Connected to MongoDB: ${config.MONGODB_URI}`);
    } else if (process.env.NODE_ENV === "test") {
      console.log("Test environment detected - skipping database connection");
    }
    const server = app.listen(config.PORT);
    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// For normal server start
if (require.main === module) {
  startServer(config).catch(console.error);
}

module.exports = { app, startServer };
