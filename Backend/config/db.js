const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// Explicitly load Backend/.env
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;