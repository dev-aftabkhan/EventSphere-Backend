const multer = require("multer");
const path = require("path");

// Temporary storage before renaming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save in 'uploads/' folder
    },
    filename: (req, file, cb) => {
        // Save with a temporary name first
        cb(null, "temp_" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
