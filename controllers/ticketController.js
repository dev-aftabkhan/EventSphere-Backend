const { createTicketService } = require('../services/ticketService');

const createTicketController = async (req, res) => {
    try {

        if (!req.user || !req.user.member_id) {
            return res.status(400).json({ message: "User ID is missing from token" });
        }

        const member_id = req.user.member_id; // ✅ Ensure this is correct
        const ticketData = await createTicketService(member_id);
        res.status(201).json(ticketData);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "An error occurred while creating the ticket" });
    }
};

module.exports = { createTicketController };
