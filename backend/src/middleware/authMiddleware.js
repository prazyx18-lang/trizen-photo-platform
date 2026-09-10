const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;


    // Check if token exists
    if (!authHeader) {

        return res.status(401).json({
            message: "Authorization token is required"
        });

    }


    // Extract token
    const token = authHeader.split(" ")[1];


    // Verify token
    jwt.verify(
        token,
        process.env.JWT_SECRET,

        (error, user) => {

            if (error) {

                return res.status(403).json({
                    message: "Invalid or expired token"
                });

            }


            // Store user information
            req.user = user;


            // Continue to next function
            next();

        }
    );

};


module.exports = authenticateToken;