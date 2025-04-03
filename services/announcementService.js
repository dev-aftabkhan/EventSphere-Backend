const db = require('../config/mysqlConfig'); // Ensure this is your MySQL connection

const getLatestAnnouncements = async () => {
    const query = `
        SELECT announcement_id, event_id, message, link_url, created_at, created_by, expired 
        FROM announcement 
        ORDER BY created_at DESC 
        LIMIT 5
    `;

    try {
        const [results] = await db.execute(query);

        return results.map(announcement => ({
            announcement_id: announcement.announcement_id,
            event_id: announcement.event_id || null,
            message: announcement.message || "",
            link_url: announcement.link_url || null,
            created_at: announcement.created_at,
            created_by: announcement.created_by || null,
            expired: announcement.expired ? true : false
        }));
    } catch (error) {
        console.error("Error fetching latest announcements:", error);
        throw error;
    }
};

module.exports = {
    getLatestAnnouncements
};
