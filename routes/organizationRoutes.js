const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

router.get('/organizations', organizationController.fetchOrganizations);

module.exports = router;
