const db = require("../config/db");


// CREATE EVENT
const createEvent = async (req, res) => {

    try {

        const { name, description, event_date } = req.body;


        // Check required fields
        if (!name) {

            return res.status(400).json({
                message: "Event name is required"
            });

        }


        // Only ADMIN can create events
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can create events"
            });

        }


        // Insert event into database
        const [result] = await db.promise().query(

            `INSERT INTO events
            (name, description, event_date, created_by)
            VALUES (?, ?, ?, ?)`,

            [
                name,
                description,
                event_date,
                req.user.id
            ]

        );


        res.status(201).json({

            message: "Event created successfully",

            eventId: result.insertId

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// GET ALL EVENTS
const getEvents = async (req, res) => {

    try {

        const [events] = await db.promise().query(
            "SELECT * FROM events"
        );

        res.status(200).json(events);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// ASSIGN TEAM MEMBER TO EVENT
const assignTeamMember = async (req, res) => {

    try {

        const { eventId } = req.params;
        const { user_id } = req.body;


        // Only ADMIN can assign team members
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can assign team members"
            });

        }


        // Check if event exists
        const [events] = await db.promise().query(
            "SELECT * FROM events WHERE id = ?",
            [eventId]
        );


        if (events.length === 0) {

            return res.status(404).json({
                message: "Event not found"
            });

        }


        // Check if user exists and is TEAM
        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE id = ? AND role = 'TEAM'",
            [user_id]
        );


        if (users.length === 0) {

            return res.status(404).json({
                message: "Team member not found"
            });

        }


        // Assign team member
        await db.promise().query(

            `INSERT INTO event_team
            (event_id, user_id)
            VALUES (?, ?)`,

            [
                eventId,
                user_id
            ]

        );


        res.status(201).json({
            message: "Team member assigned to event successfully"
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    createEvent,
    getEvents,
    assignTeamMember
};