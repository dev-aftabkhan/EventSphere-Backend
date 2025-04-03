const fs = require("fs");
const path = require("path");
const pool = require("../config/mysqlConfig"); // Now uses promises
require("dotenv").config();

const SERVER_URL = process.env.SERVER_URL
const PORT = process.env.MAINPORT;

const saveImageDetails = async (eventId, uploadedBy, caption, tempFilename) => {
    try {
        // 1️⃣ Insert image details first (with a placeholder path)
        const insertSql = `
            INSERT INTO event_images (event_id, image_location, caption, uploaded_by, image_status) 
            VALUES (?, ?, ?, ?, ?)`;

        const [insertResult] = await pool.query(insertSql, [eventId, "pending", caption, uploadedBy, "live"]);
        const imageId = insertResult.insertId;


        // 2️⃣ Rename and move file
        const newFilename = `${imageId}.png`;
        const imageUrl = `${SERVER_URL}:${PORT}/image/${newFilename}`; // Use .env values
        fs.renameSync(path.join("uploads", tempFilename), path.join("uploads", newFilename));


        // 3️⃣ Update database with final image URL
        const updateSql = `UPDATE event_images SET image_location = ? WHERE image_id = ?`;
        await pool.query(updateSql, [imageUrl, imageId]);

        return { imageId, imageLocation: imageUrl };
    } catch (error) {
        console.error("[ERROR] Unexpected Error:", error);
        throw error;
    }
};

module.exports = { saveImageDetails };
