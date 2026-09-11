const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

require("dotenv").config();

const sqlFilePath = path.join(__dirname, "../database.sql");

const sql = fs.readFileSync(sqlFilePath, "utf8");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    multipleStatements: true,

    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((error) => {

    if (error) {
        console.error("Database connection failed:", error.message);
        return;
    }

    console.log("Connected to Aiven MySQL");

    connection.query(sql, (error) => {

        if (error) {
            console.error("Error creating tables:", error.message);
            connection.end();
            return;
        }

        console.log("All tables created successfully! 🎉");

        connection.end();

    });

});