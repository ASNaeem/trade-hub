const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? "https://your-frontend-domain.com" // Your production frontend domain
    : "http://localhost:3000", // Frontend origin during local development
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies and authentication headers
};
 app.use(cors(corsOptions));

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Define Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Trade-Hub API");
});

// Attach user and item routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

// Catch-All Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Start the server

const PORT = process.env.PORT || 5000;
const server =
  process.env.NODE_ENV !== "test"
    ? app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    : null;

// Graceful Shutdown
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

module.exports = { app, server };