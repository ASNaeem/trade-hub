const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  item_id: {
    type: String,
    unique: true,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used", "Refurbished"], // Restricts to valid conditions
  },
  images: {
    type: [String],
  },
  visibility_status: {
    type: Boolean, // Boolean representation in the database
    default: true, // Default to visible
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String, // Changed from ObjectId to String
    enum: [
      "Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh",
      "Rajshahi", "Rangpur", "Sylhet"
    ], // You can specify your valid division names here
    required: true,
  },
});

module.exports = mongoose.model("Item", itemSchema);
