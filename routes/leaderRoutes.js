const express = require("express");
const router = express.Router();
const leaderController = require("../controllers/leaderController");

// Event Member Role Management
router.get("/events/:eventID/members", leaderController.getEventMembersWithRoles);  
router.get("/events/:eventID/roles", leaderController.getEventRoles);
router.put("/events/members/role", leaderController.editUserRole);
router.put("/events/role", leaderController.manageEventRoles);

// members in event
router.get("/events/:eventID/members/:username", leaderController.findMemberByUsername);
router.get("/events/members/request", leaderController.getJoinRequests);
router.post("/events/members", leaderController.addMemberToEvent);


// Update request status (using request body)
router.put("/events/members/request_status", leaderController.updateRequestStatus);

//delete user
router.delete("/users/:userID", leaderController.removeUser);

module.exports = router;