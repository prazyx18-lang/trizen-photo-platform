const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// CREATE GALLERY
const createGallery = async (req, res) => {

    try {

        const { eventId } = req.params;

        const {
            title,
            slug,
            pin
        } = req.body;


        // Only ADMIN can create gallery
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can create a gallery"
            });

        }


        // Check required fields
        if (!title || !slug || !pin) {

            return res.status(400).json({
                message: "Title, slug and PIN are required"
            });

        }


        // Check if event exists
        const [events] = await db.promise().query(

            "SELECT id FROM events WHERE id = ?",

            [eventId]

        );


        if (events.length === 0) {

            return res.status(404).json({
                message: "Event not found"
            });

        }


        // Check if slug already exists
        const [existingGallery] = await db.promise().query(

            "SELECT id FROM galleries WHERE slug = ?",

            [slug]

        );


        if (existingGallery.length > 0) {

            return res.status(400).json({
                message: "Gallery slug already exists"
            });

        }


        // Hash the PIN
        const pinHash = await bcrypt.hash(pin, 10);


        // Create gallery
        const [result] = await db.promise().query(

            `INSERT INTO galleries
            (
                event_id,
                title,
                slug,
                pin_hash,
                created_by
            )
            VALUES (?, ?, ?, ?, ?)`,

            [
                eventId,
                title,
                slug,
                pinHash,
                req.user.id
            ]

        );


        res.status(201).json({

            message: "Gallery created successfully",

            galleryId: result.insertId,

            slug: slug

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// ADD PHOTO TO GALLERY
const addPhotoToGallery = async (req, res) => {

    try {

        const { galleryId } = req.params;

        const { photo_id } = req.body;


        // Only ADMIN can add photos
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can add photos to gallery"
            });

        }


        // Check if photo_id is provided
        if (!photo_id) {

            return res.status(400).json({
                message: "Photo ID is required"
            });

        }


        // Check if gallery exists
        const [gallery] = await db.promise().query(

            "SELECT id FROM galleries WHERE id = ?",

            [galleryId]

        );


        if (gallery.length === 0) {

            return res.status(404).json({
                message: "Gallery not found"
            });

        }


        // Check if photo exists
        const [photo] = await db.promise().query(

            "SELECT id FROM photos WHERE id = ?",

            [photo_id]

        );


        if (photo.length === 0) {

            return res.status(404).json({
                message: "Photo not found"
            });

        }


        // Check if photo is already added
        const [existingPhoto] = await db.promise().query(

            `SELECT id FROM gallery_photos
            WHERE gallery_id = ?
            AND photo_id = ?`,

            [galleryId, photo_id]

        );


        if (existingPhoto.length > 0) {

            return res.status(400).json({
                message: "Photo already added to gallery"
            });

        }


        // Add photo to gallery
        await db.promise().query(

            `INSERT INTO gallery_photos
            (gallery_id, photo_id)
            VALUES (?, ?)`,

            [galleryId, photo_id]

        );


        res.status(201).json({
            message: "Photo added to gallery successfully"
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// PUBLISH GALLERY
const publishGallery = async (req, res) => {

    try {

        const { galleryId } = req.params;


        // Only ADMIN can publish gallery
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can publish a gallery"
            });

        }


        // Check if gallery exists
        const [gallery] = await db.promise().query(

            "SELECT * FROM galleries WHERE id = ?",

            [galleryId]

        );


        if (gallery.length === 0) {

            return res.status(404).json({
                message: "Gallery not found"
            });

        }


        // Publish gallery
        await db.promise().query(

            `UPDATE galleries
            SET is_published = 1,
                published_at = NOW()
            WHERE id = ?`,

            [galleryId]

        );


        res.status(200).json({

            message: "Gallery published successfully",

            shareableLink: `/gallery/${gallery[0].slug}`

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// VERIFY GALLERY PIN
const verifyGalleryPin = async (req, res) => {

    try {

        const { slug } = req.params;

        const { pin } = req.body;


        // Check if PIN is provided
        if (!pin) {

            return res.status(400).json({
                message: "PIN is required"
            });

        }


        // Find published gallery
        const [gallery] = await db.promise().query(

            `SELECT * FROM galleries
            WHERE slug = ?
            AND is_published = 1`,

            [slug]

        );


        if (gallery.length === 0) {

            return res.status(404).json({
                message: "Gallery not found or not published"
            });

        }


        // Compare entered PIN with hashed PIN
        const isPinCorrect = await bcrypt.compare(
            pin,
            gallery[0].pin_hash
        );


        if (!isPinCorrect) {

            return res.status(401).json({
                message: "Invalid PIN"
            });

        }


       // Create temporary gallery access token
const galleryToken = jwt.sign(

    {
        galleryId: gallery[0].id,
        slug: gallery[0].slug,
        type: "GALLERY_ACCESS"
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "2h"
    }

);


// Send token
res.status(200).json({

    message: "PIN verified successfully",

    galleryToken: galleryToken,

    expiresIn: "2 hours"

});


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// GET PUBLIC GALLERY
const getPublicGallery = async (req, res) => {

    try {

        const { slug } = req.params;


        // Find published gallery
        const [gallery] = await db.promise().query(

            `SELECT id, title, slug
            FROM galleries
            WHERE slug = ?
            AND is_published = 1`,

            [slug]

        );


        if (gallery.length === 0) {

            return res.status(404).json({
                message: "Gallery not found or not published"
            });

        }


        // Check if token belongs to this gallery
        if (req.galleryAccess.galleryId !== gallery[0].id) {

            return res.status(403).json({
                message: "You do not have access to this gallery"
            });

        }


        // Get all photos in this gallery
        const [photos] = await db.promise().query(

            `SELECT
                photos.id,
                photos.filename,
                photos.storage_url
            FROM gallery_photos
            JOIN photos
                ON gallery_photos.photo_id = photos.id
            WHERE gallery_photos.gallery_id = ?`,

            [gallery[0].id]

        );


        // Send gallery and photos
        res.status(200).json({

            gallery: gallery[0],

            photos: photos

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

module.exports = {
    createGallery,
    addPhotoToGallery,
    publishGallery,
    verifyGalleryPin,
    getPublicGallery
};