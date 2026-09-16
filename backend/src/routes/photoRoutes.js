const express = require("express");

const router = express.Router();

console.log("🔥 NEW PHOTO ROUTE VERSION LOADED 🔥");
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
    (req, res, next) => {

        upload.array("photos", 50)(req, res, (err) => {

            if (err) {

                console.error("MULTER ERROR:", err);

                return res.status(400).json({
                    message: err.message,
                    code: err.code
                });

            }

            next();

        });

    },
    uploadPhoto
);


// GET ALL PHOTOS FOR AN EVENT
router.get(
    "/events/:eventId/photos",
    authenticateToken,
    getEventPhotos
);


module.exports = router;