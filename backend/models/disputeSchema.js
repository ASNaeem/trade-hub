const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  resolution: {
    type: String,
    enum: ["upheld", "rejected"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  notes: [
    {
      content: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Add virtual id
disputeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON
disputeSchema.set("toJSON", { virtuals: true });

const Dispute = mongoose.model("Dispute", disputeSchema);
module.exports = Dispute;
