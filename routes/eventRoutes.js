const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/events', eventController.fetchEventCards);
router.get('/event/:event_id', eventController.fetchEventDetails);
router.get('/event/:event_id/images', eventController.fetchEventImages);
router.get('/events/current', eventController.fetchCurrentEvents);

module.exports = router;
