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

const getAllUsers = async (req, res) => {
    try {
        // Only return safe profile fields; password hashes must never go to React.
        const [users] = await db.query(
            `SELECT user_id, full_name, username, role_id, status, created_at
             FROM users
             ORDER BY created_at DESC, user_id DESC`
        );

        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Keep an admin from deleting the same account they are currently using.
        if (Number(id) === Number(req.user.user_id)) {
            return res.status(400).json({ message: "You cannot delete your own account while logged in." });
        }

        // Remove refresh tokens first because they reference the user table.
        await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [id]);

        const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createUser, getAllUsers, deleteUser };
