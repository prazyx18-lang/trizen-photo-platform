const express = require("express");

const router = express.Router();

const {
    createTeamMember,
    getTeamMembers
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");


// CREATE TEAM MEMBER
router.post(
    "/team",
    authenticateToken,
    createTeamMember
);


// GET ALL TEAM MEMBERS
router.get(
    "/team",
    authenticateToken,
    getTeamMembers
);


module.exports = router;