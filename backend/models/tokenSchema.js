const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenValue: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["reset", "verification", "refresh"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // Token documents will be automatically deleted after 15 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

tokenSchema.set("toJSON", { virtuals: true });

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
