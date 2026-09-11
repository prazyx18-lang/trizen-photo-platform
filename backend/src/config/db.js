const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((error) => {
    if (error) {
        console.error(
            "Database connection failed:",
            error.message
        );
        return;
    }

    console.log(
        "MySQL database connected successfully"
    );
});

module.exports = connection;