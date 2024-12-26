const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ["message", "item", "user"],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "reportType",
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ["inappropriate", "spam", "fraud", "harassment", "other"],
  },
  description: String,
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open",
  },
  resolution: {
    type: String,
    enum: ["warning", "delete", "ban", "no_action"],
  },
  adminNote: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for common queries
disputeSchema.index({ status: 1, createdAt: -1 });
disputeSchema.index({ reporterId: 1 });
disputeSchema.index({ reportedId: 1 });

disputeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

disputeSchema.set("toJSON", { virtuals: true });

const Dispute = mongoose.model("Dispute", disputeSchema);
module.exports = Dispute;
