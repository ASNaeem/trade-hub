const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    minlength: 10,
  },
  resolutionStatus: {
    type: String,
    enum: ["Pending", "Resolved", "Rejected"],
    default: "Pending",
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

disputeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

disputeSchema.set("toJSON", { virtuals: true });

const Dispute = mongoose.model("Dispute", disputeSchema);
module.exports = Dispute;
