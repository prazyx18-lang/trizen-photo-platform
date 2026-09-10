const express = require("express");

const router = express.Router();

const {
    uploadPhoto,
    getEventPhotos
} = require("../controllers/photoController");

const authenticateToken = require("../middleware/authMiddleware");

const upload = require("../config/multer");


// UPLOAD PHOTO
router.post(
    "/events/:eventId/photos",
    authenticateToken,
    upload.single("photo"),
    uploadPhoto
);


// GET ALL PHOTOS FOR AN EVENT
router.get(
    "/events/:eventId/photos",
    authenticateToken,
    getEventPhotos
);


module.exports = router;