const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
 
// User Management Routes
router.get("/users", adminController.getUsers);

// Event Management Routes
router.get("/events", adminController.getEvents);
router.post("/events", adminController.createEvent);
router.put("/events/:eventID", adminController.updateEvent);
router.delete("/events/:eventID", adminController.deleteEvent);

// Announcement Management Routes
router.get("/announcements", adminController.getAnnouncements);
router.post("/announcements", adminController.createAnnouncement);
router.delete("/announcements/:announcementID", adminController.deleteAnnouncement);

// Role Management Routes
router.post("/roles", adminController.createRole);

// Organization Management Routes
router.put("/organization/:orgID", adminController.updateOrganization);

module.exports = router;
