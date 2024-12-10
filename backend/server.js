const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you have the DB connection setup

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB(); // Un-comment this if you are connecting to the DB

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Trade-Hub API');
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Item routes
const itemRoutes = require('./routes/itemRoutes'); // Import the item routes
app.use('/api/items', itemRoutes); // Attach item routes to the '/api/items' endpoint

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
