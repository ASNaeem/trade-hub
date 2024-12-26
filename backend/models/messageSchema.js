const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  reportStatus: {
    type: String,
    enum: ["none", "pending", "resolved", "rejected"],
    default: "none",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for common queries
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, createdAt: -1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ isReported: 1 });
messageSchema.index({ reportStatus: 1 });

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

messageSchema.set("toJSON", { virtuals: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
