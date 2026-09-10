const db = require("../config/db");


// UPLOAD PHOTO
const uploadPhoto = async (req, res) => {

    try {

        const { eventId } = req.params;


        // Check if a file was uploaded
        if (!req.file) {

            return res.status(400).json({
                message: "Photo is required"
            });

        }


        // Allow only ADMIN and TEAM
        if (
            req.user.role !== "ADMIN" &&
            req.user.role !== "TEAM"
        ) {

            return res.status(403).json({
                message: "Only Admin or Team members can upload photos"
            });

        }


        // If TEAM member, check event assignment
        if (req.user.role === "TEAM") {

            const [assignment] = await db.promise().query(

                `SELECT * FROM event_team
                WHERE event_id = ?
                AND user_id = ?`,

                [
                    eventId,
                    req.user.id
                ]

            );


            if (assignment.length === 0) {

                return res.status(403).json({
                    message: "You are not assigned to this event"
                });

            }

        }


        // Save photo details in database
        const [result] = await db.promise().query(

            `INSERT INTO photos
            (
                event_id,
                uploaded_by,
                filename,
                storage_url,
                storage_public_id,
                file_size,
                mime_type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,

            [
                eventId,
                req.user.id,
                req.file.originalname,
                req.file.path,
                req.file.filename,
                req.file.size,
                req.file.mimetype
            ]

        );


        res.status(201).json({

            message: "Photo uploaded successfully",

            photoId: result.insertId,

            photoUrl: req.file.path

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};
// GET ALL PHOTOS FOR AN EVENT
const getEventPhotos = async (req, res) => {

    try {

        const { eventId } = req.params;


        // Only ADMIN can view uploaded photos
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can view uploaded photos"
            });

        }


        // Get all photos for the event
        const [photos] = await db.promise().query(

            `SELECT 
                photos.id,
                photos.filename,
                photos.storage_url,
                photos.file_size,
                photos.mime_type,
                photos.created_at,
                users.name AS uploaded_by_name
            FROM photos
            JOIN users ON photos.uploaded_by = users.id
            WHERE photos.event_id = ?
            ORDER BY photos.created_at DESC`,

            [eventId]

        );


        res.status(200).json(photos);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    uploadPhoto,
    getEventPhotos
};