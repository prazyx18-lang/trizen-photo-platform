const express = require("express");

const router = express.Router();

const {
    createEvent,
    getEvents,
    assignTeamMember
} = require("../controllers/eventController");

const authenticateToken = require("../middleware/authMiddleware");


// CREATE EVENT
router.post(
    "/",
    authenticateToken,
    createEvent
);

// GET ALL EVENTS
router.get(
    "/",
    authenticateToken,
    getEvents
);

// ASSIGN TEAM MEMBER TO EVENT
router.post(
    "/:eventId/team",
    authenticateToken,
    assignTeamMember
);


module.exports = router;