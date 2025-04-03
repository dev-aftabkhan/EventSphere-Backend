const mongoose = require("mongoose");
const ConsoleLogs = require("../utils/consoleLogs");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    ConsoleLogs.info("MongoDB Connected...");
  } catch (error) {
    ConsoleLogs.error("MongoDB Connection Failed:", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
