const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.get('/announcements/latest', announcementController.fetchLatestAnnouncements);

module.exports = router;
