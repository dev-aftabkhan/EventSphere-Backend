const eventService = require('../services/eventService');

const fetchEventCards = async (req, res) => {
    try {
        const { status, visibility } = req.query;
        const [events] = await eventService.getEventCards(status, visibility);
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const fetchCurrentEvents = async (req, res) => {
    try {
        const [events] = await eventService.getCurrentEvents();
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const fetchEventDetails = async (req, res) => {
    try {
        const { event_id } = req.params;
        const event = await eventService.getCompleteEventDetails(event_id);
        if (event) {
            res.status(200).json({ success: true, event });
        } else {
            res.status(404).json({ success: false, message: "Event not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const fetchEventImages = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { sort } = req.query;
        const [images] = await eventService.getEventImages(event_id, sort);
        res.status(200).json({ success: true, images });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    fetchEventCards,
    fetchEventDetails,
    fetchEventImages,
    fetchCurrentEvents
};
