const express = require('express');
const router = express.Router();

// Define a sample route for testing
router.get('/', (req, res) => {
  res.send('User routes are working!');
});

module.exports = router;
