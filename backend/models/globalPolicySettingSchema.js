const mongoose = require("mongoose");

const globalPolicySettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "minItemPrice",
      "maxItemPrice",
      "maxPriceUnverified",
      "maxActiveListings",
    ],
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "GlobalPolicySetting",
  globalPolicySettingSchema
);
