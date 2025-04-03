const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const upload = require("../middleware/uploadMiddleware");

// Route for image upload
router.post("/upload", upload.single("image"), imageController.uploadImage);

module.exports = router;
