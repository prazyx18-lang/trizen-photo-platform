const bcrypt = require("bcrypt");
const db = require("../config/db");


// CREATE TEAM MEMBER
const createTeamMember = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Only ADMIN can create team members
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can create team members"
            });

        }


        // Check if email already exists
        const [existingUser] = await db.promise().query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingUser.length > 0) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create TEAM user
        const [result] = await db.promise().query(

            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, 'TEAM')`,

            [
                name,
                email,
                hashedPassword
            ]

        );


        res.status(201).json({

            message: "Team member created successfully",

            userId: result.insertId

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// GET ALL TEAM MEMBERS
const getTeamMembers = async (req, res) => {

    try {

        // Only ADMIN can view team members
        if (req.user.role !== "ADMIN") {

            return res.status(403).json({
                message: "Only Admin can view team members"
            });

        }


        const [teamMembers] = await db.promise().query(

            `SELECT id, name, email, role
            FROM users
            WHERE role = 'TEAM'
            ORDER BY id DESC`

        );


        res.status(200).json(teamMembers);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    createTeamMember,
    getTeamMembers
};