const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// REGISTER USER
const register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;


        // Check required fields
        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // Check if user already exists
        const [existingUser] = await db.promise().query(

            "SELECT * FROM users WHERE email = ?",

            [email]

        );


        if (existingUser.length > 0) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Insert user
        await db.promise().query(

            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,

            [

                name,

                email,

                hashedPassword,

                role

            ]

        );


        res.status(201).json({

            message: "User registered successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

};

// LOGIN USER
const login = async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user
        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        // Check if user exists
        if (users.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const user = users[0];


        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Generate JWT Token
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    register,
    login
};
