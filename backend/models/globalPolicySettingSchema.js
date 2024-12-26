const mongoose = require("mongoose");

const globalPolicySettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "maxItemsPerUser",
      "maxPriceUnverified",
      "maxImagesPerItem",
      "minItemPrice",
      "maxItemPrice",
      "maxDisputesBeforeBan",
      "maxReportsBeforeReview",
    ],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
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
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Add virtual id
globalPolicySettingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON
globalPolicySettingSchema.set("toJSON", { virtuals: true });

const GlobalPolicySetting = mongoose.model(
  "GlobalPolicySetting",
  globalPolicySettingSchema
);
module.exports = GlobalPolicySetting;
