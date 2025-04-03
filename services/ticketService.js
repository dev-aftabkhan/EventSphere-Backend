const db = require('../config/mysqlConfig');
const { generateTicketId } = require('../utils/generateTicketId');
const DiscordWebhook = require('../webhooks/discordWebhook'); // Import the webhook utility

const createTicketService = async (member_id) => {
    const status = "pending";
    const created_on = new Date();
    const ticket_id = await generateTicketId();

    const query = `INSERT INTO help_request (ticket_id, member_id, status, created_on, resolved_on, resolved_by, self_resolved)
                   VALUES (?, ?, ?, ?, NULL, NULL, NULL)`;

    await db.execute(query, [ticket_id, member_id, status, created_on]);

    // ✅ **Send ticket details to Discord after creation**
    const discordMessage = `🎫 **New Ticket Created** 🎫\n
    **Ticket ID:** ${ticket_id}\n
    **Member ID:** ${member_id}\n
    **Status:** ${status}\n
    **Created On:** ${created_on.toISOString()}`;

    await DiscordWebhook.sendMessage(discordMessage);

    return { ticket_id, message: `Ticket created successfully` };
};

module.exports = { createTicketService };
