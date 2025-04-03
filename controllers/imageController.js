const imageService = require("../services/imageService");

const uploadImage = async (req, res) => {
    try {

        if (!req.file) {
            console.log("[ERROR] No file received!");
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const { eventId, uploadedBy, caption } = req.body;
        const tempFilename = req.file.filename;


        const { imageId, imageLocation } = await imageService.saveImageDetails(eventId, uploadedBy, caption, tempFilename);

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            imageId,
            imageLocation
        });

    } catch (error) {
        console.error("[ERROR] Unexpected Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected error occurred",
            error: error.message
        });
    }
};

module.exports = { uploadImage };
