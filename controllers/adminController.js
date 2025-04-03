const adminService = require("../services/adminService");

// Get All Users
const getUsers = async (req, res) => {
    try {
        const data = await adminService.getUsers();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

// Get All Events
const getEvents = async (req, res) => {
    try {
        const data = await adminService.getEvents();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving events", error: error.message });
    }
};

// ✅ Create an Event
const createEvent = async (req, res) => {
    try {
        const { event_name, event_description, date, created_by } = req.body;
        const data = await adminService.createEvent(event_name, event_description, date, created_by);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

// Update an Event
const updateEvent = async (req, res) => {
    try {
        const {
            event_name, event_description, date, venue, event_status, 
            registration_status, visibility, updated_by, links
        } = req.body;

        const eventID = req.params.eventID;

        const result = await adminService.updateEvent(
            eventID, event_name, event_description, date, venue, 
            event_status, registration_status, visibility, updated_by, links
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

// Archive an Event (Soft Delete)
const deleteEvent = async (req, res) => {
    try {
        const data = await adminService.deleteEvent(req.params.eventID);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error archiving event", error: error.message });
    }
};

// Get All Announcements
const getAnnouncements = async (req, res) => {
    try {
        const data = await adminService.getAnnouncements();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving announcements", error: error.message });
    }
};

// Create an Announcement
const createAnnouncement = async (req, res) => {
    try {
        const { event_id, message, link_url, created_by } = req.body;
        const data = await adminService.createAnnouncement(event_id, message, link_url, created_by);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error creating announcement", error: error.message });
    }
};

// Expire an Announcement (Soft Delete)
const deleteAnnouncement = async (req, res) => {
    try {
        const data = await adminService.deleteAnnouncement(req.params.announcementID);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error expiring announcement", error: error.message });
    }
};

// Create a New Role
const createRole = async (req, res) => {
    try {
        const { event_id, role_name, created_by } = req.body;
        const data = await adminService.createRole(event_id, role_name, created_by);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error creating role", error: error.message });
    }
};

 
// Update Organization Details
const updateOrganization = async (req, res) => {
    try {
        const { orgID } = req.params;
        const { org_name, about_us, contact_no, org_profile_loc, other_images, referral_links } = req.body;
        const data = await adminService.updateOrganization(orgID, org_name, about_us, contact_no, org_profile_loc, other_images, referral_links);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error updating organization", error: error.message });
    }
};

module.exports = {
    getUsers,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    createRole,
    updateOrganization
};
