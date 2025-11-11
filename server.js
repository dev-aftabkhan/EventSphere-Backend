require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Security headers
const compression = require("compression"); // Gzip compression
const apiRoutes = require("./routes");
const ConsoleLogs = require("./utils/consoleLogs");
const mysqlConfig = require("./config/mysqlConfig");
const connectDB = require("./config/mongoConfig");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Restrict origins in production
app.use(express.json({ limit: "24mb" })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: "24mb" })); // Parse URL-encoded data

// Serve images
// Serve images publicly over the internet with proper CORS headers
app.use(
    "/image",
    (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
      // ✅ FIX: Allow images to be accessed from any domain (removes CORP restrictions)
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  
      // ✅ Allow images to load anywhere, including scripts, iframes, and styles
      res.setHeader("Content-Security-Policy", "default-src *; img-src * data: blob:;");
  
      next();
    },
    express.static("uploads")
);
  

// API Routes
app.use("/api", apiRoutes);

const PORT = process.env.MAINPORT || 2025;

// Function to test MySQL connection before starting the server
const connectDatabases = async () => {
    try {
        const connection = await mysqlConfig.getConnection();
        await connection.ping(); // Test MySQL connection
        connection.release();

        ConsoleLogs.info("Connected to MySQL database");

        app.listen(PORT, '0.0.0.0' ,() => ConsoleLogs.info(`Server running on port ${PORT}`));
    } catch (error) {
        ConsoleLogs.error("Database connection failed", { message: error.message, stack: error.stack });
        process.exit(1);
    }
};

process.on("uncaughtException", (err) => {
    ConsoleLogs.error("Uncaught Exception:", { message: err.message, stack: err.stack });
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    ConsoleLogs.error("Unhandled Promise Rejection:", { reason });
});

// Connect to databases & start the server
connectDatabases();
