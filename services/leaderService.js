const db = require('../config/mysqlConfig'); // MySQL connection

// ✅ Fetch Organization Member Join Requests (Pending/Expired)
const getJoinRequests = async () => {
    const query = `
        SELECT em.event_id, em.event_member_id, om.member_id, om.username, 
               COALESCE(om.profile_pic, '') AS profile_pic_location, em.request_status
        FROM event_member em
        JOIN organization_member om ON em.member_id = om.member_id
        WHERE em.request_status IN ('pending', 'expired')`;
    const [results] = await db.execute(query);
    return results;
};


// Get List of Event Members with Their Roles
const getEventMembersWithRoles = async (eventID) => {
    const query = `
       SELECT 
    em.event_member_id, 
    om.username, 
    er.role_name,
    om.profile_pic
FROM event_member em
LEFT JOIN organization_member om ON em.member_id = om.member_id
LEFT JOIN members_role mr ON em.event_member_id = mr.member_id
LEFT JOIN event_role er ON mr.role_id = er.role_id
WHERE em.event_id = ? 
AND em.removed = 0   
AND (mr.removed = 0 OR mr.removed IS NULL)
AND (er.removed = 0 OR er.removed IS NULL);   
    `;
    const [results] = await db.execute(query, [eventID]);
    return results;
};

//get all event roles
const getEventRoles = async (eventID) => {
    const query = `SELECT role_id, role_name FROM event_role WHERE event_id = ? AND removed = 0`;
    const [results] = await db.execute(query, [eventID]);
    return results;
};

//find memeber by username in event
const findMemberByUsername = async (eventID, username) => {
    const query = `
        SELECT 
            em.event_member_id, 
            om.username, 
            er.role_name,
            om.profile_pic,
            em.request_status as is_member
        FROM event_member em
        LEFT JOIN organization_member om ON em.member_id = om.member_id
        LEFT JOIN members_role mr ON em.event_member_id = mr.member_id
        LEFT JOIN event_role er ON mr.role_id = er.role_id
        WHERE em.event_id = ? 
        AND om.username = ?
        AND em.removed = 0   
        AND (mr.removed = 0 OR mr.removed IS NULL)
        AND (er.removed = 0 OR er.removed IS NULL);   
    `;
    const [results] = await db.execute(query, [eventID, username]);
    return results;
};

//update request status
const updateRequestStatus = async (event_member_id, request_status, actioned_by) => {
    const query = `UPDATE event_member 
SET request_status = ?, 
    actioned_by = ?, 
    actioned_timestamp = NOW() 
WHERE event_member_id = ?
`;
    await db.execute(query, [request_status, actioned_by, event_member_id]);
    return { message: "Request status updated successfully" };
};

// Soft Delete a User (Mark as Removed)
const removeUser = async (userID, removed_by) => {
    const query = `UPDATE event_member 
SET removed = 1, 
    removed_by = ?, 
    removed_at = NOW() 
WHERE event_member_id = ?
`;
    await db.execute(query, [removed_by, userID]);
    return { message: "User marked as removed successfully" };
};

// Edit User Role
const editUserRole = async (event_member_id, role_id, event_id) => {
    // ✅ Check if the role exists and is active (removed = 0)
    const roleCheckQuery = `SELECT role_id FROM event_role WHERE role_id = ? AND event_id = ? AND removed = 0`;
    const [roleExists] = await db.execute(roleCheckQuery, [role_id, event_id]);

    if (roleExists.length === 0) {
        throw new Error("Role does not exist or has been removed.");
    }

    // ✅ Check if the user is part of the event
    const memberCheckQuery = `SELECT event_member_id FROM event_member WHERE event_member_id = ? AND event_id = ? AND removed = 0`;
    const [memberExists] = await db.execute(memberCheckQuery, [event_member_id, event_id]);

    if (memberExists.length === 0) {
        throw new Error("User is not part of the event or has been removed.");
    }

    // ✅ Check if the role is already assigned to the user
    const roleAssignedQuery = `SELECT member_role_id, removed FROM members_role WHERE member_id = ? AND role_id = ?`;
    const [roleAssigned] = await db.execute(roleAssignedQuery, [event_member_id, role_id]);

    if (roleAssigned.length > 0) {
        // ✅ If role exists but was removed, reactivate it
        if (roleAssigned[0].removed === 1) {
            const updateRoleQuery = `
                UPDATE members_role 
                SET removed = 0, removed_by = NULL, removed_at = NULL 
                WHERE member_role_id = ?;
            `;
            await db.execute(updateRoleQuery, [roleAssigned[0].member_role_id]);
            return { message: "Role reactivated successfully" };
        } else {
            return { message: "User already has this role assigned." };
        }
    }

    // ✅ If role doesn't exist, assign it
    const assignRoleQuery = `
        INSERT INTO members_role (member_id, role_id) 
        VALUES (?, ?);
    `;
    await db.execute(assignRoleQuery, [event_member_id, role_id]);

    return { message: "User role assigned successfully" };
};

//add or remove role
const manageEventRoles = async (event_id, created_by, removed_by, roles) => {
    if (!event_id || !roles || roles.length === 0) {
        throw new Error("Missing required fields: event_id and roles list are mandatory.");
    }

    const queries = [];

    // ✅ Handle Role Removal (Soft Delete)
    if (removed_by && roles.removed && roles.removed.length > 0) {
        const removeQuery = `
            UPDATE event_role 
            SET removed = 1, removed_by = ?, removed_at = NOW() 
            WHERE event_id = ? AND role_name IN (${roles.removed.map(() => "?").join(",")});
        `;
        queries.push({
            query: removeQuery,
            values: [removed_by, event_id, ...roles.removed]
        });
    }

    // ✅ Handle Role Creation (Only if not already present)
    if (created_by && roles.added && roles.added.length > 0) {
        const addQuery = `
            INSERT INTO event_role (event_id, role_name, created_at, created_by)
            SELECT ?, ?, NOW(), ?
            WHERE NOT EXISTS (
                SELECT 1 FROM event_role WHERE event_id = ? AND role_name = ? AND removed = 0
            );
        `;

        roles.added.forEach(role => {
            queries.push({
                query: addQuery,
                values: [event_id, role, created_by, event_id, role]
            });
        });
    }

    try {
        for (const q of queries) {
            await db.execute(q.query, q.values);
        }

        return { message: "Event roles updated successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

//add member to event
const addMemberToEvent = async (member_id, event_id, actioned_by) => {
    if (!member_id || !event_id || !actioned_by) {
        throw new Error("Missing required fields: member_id, event_id, actioned_by.");
    }

    try {
        // ✅ Insert Member into Event with all required fields
        const addMemberQuery = `
           INSERT INTO event_member (
    member_id, event_id, request_status, request_timestamp, actioned_by, actioned_timestamp, removed, unread_count) 
SELECT ?, ?, 'accepted', NOW(), ?, NOW(), 0, '{"admin_chat_tag_count": 1, "event_chat_tag_count": 2, "event_task_board_count": 3}'
WHERE NOT EXISTS (
    SELECT 1 FROM event_member WHERE member_id = ? AND event_id = ?
);

        `;
        await db.execute(addMemberQuery, [member_id, event_id, actioned_by, member_id, event_id]);

        // ✅ Get Volunteer Role ID (if exists and not removed)
        const volunteerRoleQuery = `SELECT role_id FROM event_role WHERE event_id = ? AND role_name = 'Volunteer' AND removed = 0`;
        const [volunteerRole] = await db.execute(volunteerRoleQuery, [event_id]);

        if (volunteerRole.length === 0) {
            return { message: "Member added to event, but no active 'Volunteer' role found." };
        }

        const volunteerRoleID = volunteerRole[0].role_id;

        // ✅ Assign Volunteer Role to Member (if Volunteer role exists)
        const assignRoleQuery = `
            INSERT INTO members_role (role_id, member_id)
            SELECT ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM members_role WHERE role_id = ? AND member_id = ?
            );
        `;
        await db.execute(assignRoleQuery, [volunteerRoleID, member_id, volunteerRoleID, member_id]);

        return { message: "Member added to event and assigned 'Volunteer' role." };

    } catch (error) {
        throw new Error(error.message);
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