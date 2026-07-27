const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { fullName, username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." })
        }

        if (!role) {
            return res.status(400).json({ message: "Role is required." })
        }

        const [existingUsers] = await db.query(
            `SELECT user_id FROM users WHERE username = ? LIMIT 1`,
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "Username already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const sql = `INSERT INTO users(full_name, username, password_hash, role_id, status)
        VALUES(?, ?, ?, ?, ?) `;

        const values = [fullName, username, hashedPassword, role, 'Active'];

        const [result] = await db.query(sql, values);

        return res.status(201).json({
            message: "New user created successfully...",
            data: {
                id: result.insertId,
                fullName,
                username,
                role,
                status: 'Active'
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getUsers = async (req, res) => {
    try {
        const sql = `
            SELECT
                user_id AS id,
                full_name AS fullName,
                username,
                role_id AS role,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM users
            ORDER BY created_at DESC, user_id DESC
        `;

        const [users] = await db.query(sql);

        return res.status(200).json({ data: users });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = { createUser, getUsers };
