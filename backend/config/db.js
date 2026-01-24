const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[DB] Database connected successfully");
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    process.exit(1);
  }
};
module.exports = connectDb;
