const express = require("express");
const router = express.Router();
const createTicketController = require("../controllers/ticketController");

router.post("/raiseTicket", createTicketController.createTicketController);

module.exports = router;
