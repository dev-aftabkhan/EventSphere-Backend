const db = require('../config/mysqlConfig'); // MySQL connection

 
// Get All Users
const getUsers = async () => {
    const query = `SELECT member_id, username, personal_email, view_role FROM organization_member`;
    const [results] = await db.execute(query);
    return results;
};

 

// Get All Events
const getEvents = async () => {
    const query = `SELECT event_id, event_name, event_status FROM event`;
    const [results] = await db.execute(query);
    return results;
};

// ✅ Create an Event
const createEvent = async (event_name, event_description, date, created_by) => {
    const query = `INSERT INTO event (event_name, event_description, date, created_by) VALUES (?, ?, ?, ?)`;
    await db.execute(query, [event_name, event_description, date, created_by]);
    return { message: "Event created successfully" };
};
// Update an Event
const updateEvent = async (
    eventID, event_name, event_description, date, venue, 
    event_status, registration_status, visibility, updated_by, 
    links // Array of { link_id, link_url, placeholder, created_by }
) => {
    const updateEventQuery = `
        UPDATE event 
        SET event_name = ?, event_description = ?, date = ?, venue = ?, 
            event_status = ?, registration_status = ?, visibility = ?, updated_by = ?
        WHERE event_id = ?;
    `;

    try {
        await db.execute(updateEventQuery, [
            event_name, event_description, date, venue, event_status, 
            registration_status, visibility, updated_by, eventID
        ]);

        for (const link of links) {
            if (link.link_id) {
                // Update existing link
                const updateLinkQuery = `
                    UPDATE event_links 
                    SET link_url = ?, placeholder = ?, updated_by = ?
                    WHERE event_id = ? AND link_id = ?;
                `;
                await db.execute(updateLinkQuery, [
                    link.link_url, link.placeholder, updated_by, eventID, link.link_id
                ]);
            } else {
                // Insert new link
                const insertLinkQuery = `
                    INSERT INTO event_links (event_id, link_url, placeholder, created_by)
                    SELECT ?, ?, ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM event_links WHERE event_id = ? AND link_url = ? AND placeholder = ?
                    );
                `;
                await db.execute(insertLinkQuery, [
                    eventID, link.link_url, link.placeholder, link.created_by,
                    eventID, link.link_url, link.placeholder
                ]);
            }
        }

        return { message: "Event and links updated successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Archive an Event
const deleteEvent = async (eventID) => {
    const query = `UPDATE event SET visibility = 'archived' WHERE event_id = ?`;
    await db.execute(query, [eventID]);
    return { message: "Event archived successfully" };
};

// Get Latest Announcements
const getAnnouncements = async () => {
    const query = `
        SELECT a.announcement_id, a.message, el.link_url, a.created_at 
        FROM announcement a
        LEFT JOIN event_links el ON a.link_url = el.link_id
        ORDER BY a.created_at DESC
    `;
    const [results] = await db.execute(query);
    return results;
};

// Create an Announcement
const createAnnouncement = async (event_id, message, link_url, created_by) => {
    const query = `INSERT INTO announcement (event_id, message, link_url, created_at, expired, created_by) 
                   VALUES (?, ?, ?, NOW(), 0, ?)`;
    await db.execute(query, [event_id, message, link_url, created_by]);
    return { message: "Announcement created successfully" };
};

// Expire an Announcement
const deleteAnnouncement = async (announcementID) => {
    const query = `UPDATE announcement SET expired = 1 WHERE announcement_id = ?`;
    await db.execute(query, [announcementID]);
    return { message: "Announcement marked as expired successfully" };
};

// Create a New Role
const createRole = async (event_id, role_name, created_by) => {
    const query = `INSERT INTO event_role (event_id, role_name, created_at, created_by) VALUES (?, ?, NOW(), ?)`;
    await db.execute(query, [event_id, role_name, created_by]);
    return { message: "Role created successfully" };
};


// Update Organization Details
const updateOrganization = async (orgID, org_name, about_us, contact_no, org_profile_loc, other_images, referral_links) => {
    const query = `
        UPDATE organization 
        SET org_name = ?, about_us = ?, contact_no = ?, org_profile_loc = ?, other_images = ?, referral_links = ?
        WHERE org_id = ?
    `;
    await db.execute(query, [org_name, about_us, contact_no, org_profile_loc, JSON.stringify(other_images), JSON.stringify(referral_links), orgID]);
    return { message: "Organization details updated successfully" };
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
