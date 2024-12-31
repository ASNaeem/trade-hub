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
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  favourites: {
    type: [String],
    required: true,
    default: [],
  },
  verification: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    documentType: {
      type: String,
      enum: ["NID", "Birth Certificate", "Passport"],
    },
    documentNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    documentPath: {
      type: String,
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    rejectionReason: {
      type: String,
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
