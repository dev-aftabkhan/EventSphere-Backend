const db = require('../config/mysqlConfig'); // MySQL connection

const generateTicketId = async () => {
    try {
        const query = `SELECT MAX(ticket_id) AS maxId FROM help_request`;
        const [rows] = await db.execute(query);
        const maxId = rows[0].maxId || 0; // If no rows, start from 0
        return maxId + 1; // Return the next ticket ID
    } catch (error) {
        console.error('Error generating ticket ID:', error);
        throw error;
    }
};

module.exports = { generateTicketId };
