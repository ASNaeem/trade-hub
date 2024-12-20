const mongoose = require("mongoose");

const globalPolicySettingsSchema = new mongoose.Schema({
  policyName: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

globalPolicySettingsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

globalPolicySettingsSchema.set("toJSON", { virtuals: true });

const GlobalPolicySettings = mongoose.model("GlobalPolicySettings", globalPolicySettingsSchema);
module.exports = GlobalPolicySettings; 