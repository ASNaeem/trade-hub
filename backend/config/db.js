const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";
    await mongoose.connect(dbUri);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;
