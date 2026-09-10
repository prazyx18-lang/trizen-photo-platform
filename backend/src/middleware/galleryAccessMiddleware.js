const jwt = require("jsonwebtoken");

const verifyGalleryAccess = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({
                message: "Gallery access token is required"
            });

        }


        // Expected format:
        // Bearer TOKEN
        const token = authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message: "Invalid gallery token format"
            });

        }


        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Check token type
        if (decoded.type !== "GALLERY_ACCESS") {

            return res.status(403).json({
                message: "Invalid gallery access token"
            });

        }


        // Make gallery data available
        req.galleryAccess = decoded;


        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired gallery access token"
        });

    }

};


module.exports = verifyGalleryAccess;