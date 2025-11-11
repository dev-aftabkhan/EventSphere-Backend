const express = require("express");
const authRoutes = require("./authRoutes");
const imageRoutes = require("./imageRoutes");
const eventRoutes = require('./eventRoutes');
const organizationRoutes = require('./organizationRoutes');
const announcementRoutes = require('./announcementRoutes');
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const adminRoutes = require('./adminRoutes');
const leaderRoutes = require('./leaderRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const ticketRoutes  = require('./ticketRoutes');

const router = express.Router();

// auth routes
router.use("/auth", authRoutes);

// admin routes
router.use("/image", apiKeyMiddleware(1), imageRoutes);
router.use("/admin", apiKeyMiddleware(1), adminRoutes);

// leader routes
router.use("/leader", apiKeyMiddleware(2), leaderRoutes);

// Fetch routes
router.use("/fetch", apiKeyMiddleware(4), eventRoutes);
router.use("/fetch", apiKeyMiddleware(4), organizationRoutes);
router.use("/fetch", apiKeyMiddleware(4), announcementRoutes);

router.use("/user", apiKeyMiddleware(4), authMiddleware , ticketRoutes)


module.exports = router;
