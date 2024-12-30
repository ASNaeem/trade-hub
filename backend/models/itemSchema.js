const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Used", "Refurbished"],
    },
    images: [
      {
        type: {
          type: String,
          required: true,
          enum: ["url", "buffer", "base64"],
          default: "url",
        },
        url: {
          type: String,
        },
        data: {
          type: String,
        },
        contentType: {
          type: String,
        },
      },
    ],
    location: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.set("toJSON", { virtuals: true });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
