const announcementService = require('../services/announcementService');

const fetchLatestAnnouncements = async (req, res) => {
    try {
        const data = await announcementService.getLatestAnnouncements();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving announcements", error: error.message });
    }
};

module.exports = {
    fetchLatestAnnouncements
};
