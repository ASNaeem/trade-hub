const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
//connectDB();

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Trade-Hub API');
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
