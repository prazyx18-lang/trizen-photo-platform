const express = require("express");

const router = express.Router();

const {
    uploadPhoto,
    getEventPhotos
} = require("../controllers/photoController");

const authenticateToken = require("../middleware/authMiddleware");

const upload = require("../config/multer");


// ========================================
// UPLOAD MULTIPLE PHOTOS
// ========================================

router.post(
    "/events/:eventId/photos",
    authenticateToken,

    (req, res, next) => {

        upload.any()(req, res, (err) => {

            if (err) {

                console.error("🔥 MULTER ERROR:", err);

                return res.status(400).json({
                    message: err.message,
                    code: err.code,
                    field: err.field
                });

            }

            console.log("🔥 MULTER SUCCESS");
            console.log("FILES RECEIVED:", req.files?.length);

            next();

        });

    },

    uploadPhoto
);


// ========================================
// GET ALL PHOTOS FOR AN EVENT
// ========================================

router.get(
    "/events/:eventId/photos",
    authenticateToken,
    getEventPhotos
);


module.exports = router;