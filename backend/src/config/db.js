const mysql = require("mysql2");

require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.getConnection((error, connection) => {

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

    connection.release();

});

module.exports = pool;