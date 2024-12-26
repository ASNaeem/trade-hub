const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?\d{10,14}$/, "Please provide a valid phone number"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  govtDocument: {
    documentType: {
      type: String,
      enum: ["NID", "Birth Certificate"],
    },
    documentNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    documentImage: {
      data: Buffer,
      contentType: String,
    },
  },
  isDocumentVerified: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  banReason: {
    type: String,
  },
  isUnderReview: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
