const leaderService = require('../services/leaderService');

//get join requests
const getJoinRequests = async (req, res) => {
    try {
        const data = await leaderService.getJoinRequests();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving join requests", error: error.message });
    }
};

// Get List of Event Members with Their Roles
const getEventMembersWithRoles = async (req, res) => {
    try {
        const data = await leaderService.getEventMembersWithRoles(req.params.eventID);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving event members", error: error.message });
    }
};

//get all event roles
const getEventRoles = async (req, res) => {
    try {
        const data = await leaderService.getEventRoles(req.params.eventID);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving event roles", error: error.message });
    }
};

//find memeber by username in event
const findMemberByUsername = async (req, res) => {
    try {
        const data = await leaderService.findMemberByUsername(req.params.eventID, req.params.username);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving event members", error: error.message });
    }
};

//update request status
const updateRequestStatus = async (req, res) => {
    try {
        const data = await leaderService.updateRequestStatus(req.body.event_member_id, req.body.request_status, req.body.actioned_by);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error updating request status", error: error.message });
    }
};

// Soft Delete a User (Mark as Removed)
const removeUser = async (req, res) => {
    try {
        const data = await leaderService.removeUser(req.params.userID, req.body.removed_by);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error removing user", error: error.message });
    }
};

 //edit user role
 const editUserRole = async (req, res) => {
    try {
        const { event_member_id, role_id, event_id } = req.body;

        if (!event_member_id || !role_id || !event_id) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const result = await leaderService.editUserRole(event_member_id, role_id,   event_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

//manage event roles
const manageEventRoles = async (req, res) => {
    try {
        const { event_id, created_by, removed_by, role_name } = req.body;

        if (!event_id || !role_name) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const result = await leaderService.manageEventRoles(event_id, created_by, removed_by, role_name);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

//add member to event

const addMemberToEvent = async (req, res) => {
    try {
        const { member_id, event_id, actioned_by } = req.body;

        if (!member_id || !event_id || !actioned_by) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const result = await leaderService.addMemberToEvent(member_id, event_id, actioned_by);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};
module.exports = {
    getJoinRequests,
    getEventMembersWithRoles,
    getEventRoles,
    findMemberByUsername,
    updateRequestStatus,
    removeUser,
    editUserRole,
    manageEventRoles,
    addMemberToEvent
};