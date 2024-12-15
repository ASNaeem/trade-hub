const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
    type: String,
    enum: [
      "Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh",
      "Rajshahi", "Rangpur", "Sylhet",
    ], // Specify valid division names here
    required: true,
  },
  sellerId:{
    type: String,
    required: true
  }
});

itemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

itemSchema.set("toJSON", { virtuals: true });

// Create a model from the schema
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
