const pool = require('../config/mysqlConfig'); // Assuming you have a DB connection module

const getEventCards = async (status, visibility) => {
    let query = `SELECT event_id, event_name, event_status, event_description, event_image, date, venue FROM event WHERE 1=1 and event_status = 'upcoming' OR event_status = 'ongoing' or event_status = 'completed'`;
    let params = [];

    if (status) {
        query += ` AND event_status = ?`;
        params.push(status);
    }
    if (visibility) {
        query += ` AND visibility = ?`;
        params.push(visibility);
    }

    return pool.execute(query, params);
};

const getCurrentEvents = async () => {
    const query = `
        SELECT event_id, event_name, event_status, event_image, date, venue 
        FROM event 
        WHERE event_status = 'upcoming' OR event_status = 'ongoing'
    `;
    return pool.execute(query);
};

const getEventImages = async (event_id, sortBy) => {
    let query = `SELECT image_id, image_location, caption, uploaded_by FROM event_images WHERE event_id = ?`;
    
    if (sortBy === 'caption') {
        query += ` ORDER BY caption ASC`;
    }

    return pool.execute(query, [event_id]);
};

// New function to fetch complete event details
const getCompleteEventDetails = async (event_id) => {
    // Fetch event details
    const eventQuery = `
        SELECT event_id, event_name, event_status, event_description, event_image, date, venue, registration_status, visibility 
        FROM event 
        WHERE event_id = ?
    `;
    const [eventRows] = await pool.execute(eventQuery, [event_id]);

    if (eventRows.length === 0) {
        return null; // No event found
    }
    const event = eventRows[0];

    // Fetch event images
    const imageQuery = `SELECT image_location AS image_link, caption FROM event_images WHERE event_id = ?`;
    const [imageRows] = await pool.execute(imageQuery, [event_id]);

    // Fetch event links
    const linksQuery = `SELECT link_url, placeholder FROM event_links WHERE event_id = ?`;
    const [linksRows] = await pool.execute(linksQuery, [event_id]);

    // Construct response object
    return {
        event_id: event.event_id,
        event_name: event.event_name,
        event_status: event.event_status,
        event_description: event.event_description,
        event_thumbnail: event.event_image,
        event_date: event.date,
        event_venue: event.venue,
        event_registration_status: event.registration_status,
        event_visibility: event.visibility,
        event_other_images: imageRows,
        event_captioned_images: imageRows,
        event_links: linksRows
    };
};

module.exports = {
    getEventCards,
    getEventImages,
    getCurrentEvents,
    getCompleteEventDetails
};
