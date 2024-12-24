const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Load config based on environment
const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
};

console.log("Starting server with config:", {
  PORT: config.PORT,
  MONGODB_URI: config.MONGODB_URI.split("@")[1] || "local", // Log DB URI without credentials
});

// CORS Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
  });

  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return res.status(200).end();
  }

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

const startServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(config.MONGODB_URI);
    console.log("MongoDB connected successfully");

    server = app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  console.error("Startup error:", error);
  process.exit(1);
});

module.exports = { app };
