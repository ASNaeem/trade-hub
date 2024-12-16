const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: function (v) {
          // Ensure each image is a valid URL
          return v.every(image => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(image));
        },
        message: "Each image must be a valid URL.",
      },
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
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model if needed
      ref: 'User', // Change to 'User' if sellerId corresponds to a User document
      required: true,
    }
  }
);

// Expose id as a virtual field
itemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

itemSchema.set("toJSON", { virtuals: true });

// Create a model from the schema
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
