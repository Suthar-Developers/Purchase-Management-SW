const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { fullName, username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." })
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const sql = `INSERT INTO users(full_name, username, password_hash, role_id)
        VALUES(?, ?, ?, ?) `;

        const values = [fullName, username, hashedPassword, role];

        await db.query(sql, values);

        return res.status(201).json({ message: "New user created successfully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        )

        if (!rows || rows.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            message: "Login successful"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {createUser, loginUser};