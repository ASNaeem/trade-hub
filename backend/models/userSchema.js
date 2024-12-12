const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?\d{10,14}$/, "Please provide a valid phone number"], // Phone validation
  },
  itemsListed: {
    type: [String], // Array of item IDs that the user has listed
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
