const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Load config based on environment
const config =
  process.env.NODE_ENV === "test"
    ? require("./config/test.config")
    : require("./config/dev");

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const itemRoutes = require("./routes/itemRoutes");
const messageRoutes = require("./routes/messageRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const globalPolicySettingsRoutes = require("./routes/globalPolicySettingsRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/policies", globalPolicySettingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

let server;

const startServer = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    server = app.listen(config.PORT);
    return server;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const stopServer = async () => {
  if (server) {
    await mongoose.connection.close();
    await new Promise((resolve) => server.close(resolve));
  }
};

module.exports = { app, startServer, stopServer };
