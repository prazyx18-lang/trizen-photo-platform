const express = require("express");

const router = express.Router();

const {
    createGallery,
    addPhotoToGallery,
    publishGallery,
    verifyGalleryPin,
    getPublicGallery
} = require("../controllers/galleryController");

const authenticateToken = require("../middleware/authMiddleware");
const verifyGalleryAccess = require("../middleware/galleryAccessMiddleware");


// CREATE GALLERY
router.post(
    "/events/:eventId/galleries",
    authenticateToken,
    createGallery
);


// ADD PHOTO TO GALLERY
router.post(
    "/galleries/:galleryId/photos",
    authenticateToken,
    addPhotoToGallery
);

// PUBLISH GALLERY
router.patch(
    "/galleries/:galleryId/publish",
    authenticateToken,
    publishGallery
); 

// VERIFY GALLERY PIN - PUBLIC
router.post(
    "/public/gallery/:slug/verify-pin",
    verifyGalleryPin
);

// GET PUBLIC GALLERY
router.get(
    "/public/gallery/:slug",
    verifyGalleryAccess,
    getPublicGallery
);
module.exports = router;