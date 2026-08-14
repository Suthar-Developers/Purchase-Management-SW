const db = require('../config/db');
const bcrypt = require('bcrypt');

// Password validation

const validatePassword = (password) => {
    if (!password || typeof password !== "string") {
        return "Password is required.";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!/\d/.test(password)) {
        return "Password must contain at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character.";
    }

    return null;
};


// Create new user

const createUser = async (req, res) => {
    try {
        const { fullName, username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            })
        }

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required.",
            });
        }

        const passwordError = validatePassword(password);

        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError,
            });
        }

        // Check duplicate username
        const [existingUsers] = await db.query(
            `SELECT user_id
             FROM users
             WHERE username = ?
             LIMIT 1`,
            [username.trim()]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 15);

        // Creating user
        const sql = `INSERT INTO users(full_name, username, password_hash, role, status)
        VALUES(?, ?, ?, ?, 'Active') `;

        const values = [fullName, username, hashedPassword, role];

        await db.query(sql, values);

        return res.status(201).json({
            success: true,
            message: "New user created successfully..."
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Only return safe profile fields; password hashes must never go to React.
        const [users] = await db.query(
            `SELECT user_id, full_name, username, role, status, created_at, updated_at
             FROM users
             ORDER BY created_at DESC, user_id DESC`
        );

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Edit user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fullName,
            username,
            role,
        } = req.body;

        if (!fullName || !username || !role) {
            return res.status(400).json({
                success: false,
                message: "Full name, username and role are required.",
            });
        }

        // Check user exists
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check duplicate user

        const [duplicateUsers] = await db.query(
            `SELECT user_id
             FROM users
             WHERE username = ?
               AND user_id != ?
             LIMIT 1`,
            [
                username.trim(),
                id,
            ]
        );

        if (duplicateUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });
        }

        // Update details
        await db.query(
            `UPDATE users
             SET
                full_name = ?,
                username = ?,
                role = ?
             WHERE user_id = ?`,
            [
                fullName.trim(),
                username.trim(),
                role,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
        });

    } catch (error) {
        console.error("Update user error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// Activate / Deactivate user
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Active", "Inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use Active or Inactive.",
            });
        }

        // Prevent admin from deactivating own account
        if (
            Number(id) === Number(req.user.user_id) &&
            status === "Inactive"
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account.",
            });
        }

        // Check user
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Update status
        await db.query(
            `UPDATE users
             SET status = ?
             WHERE user_id = ?`,
            [
                status,
                id,
            ]
        );

        // If user is deactivated, revoke all refresh tokens
        if (status === "Inactive") {
            await db.query(
                `DELETE FROM refresh_tokens
                 WHERE user_id = ?`,
                [id]
            );
        }

        return res.status(200).json({
            success: true,
            message:
                status === "Active"
                    ? "User activated successfully."
                    : "User deactivated successfully.",
        });

    } catch (error) {
        console.error("Update user status error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// Reset User Password
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const passwordError = validatePassword(password);

        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError,
            });
        }

        // Check user exists
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Hash new password

        const hashedPassword = await bcrypt.hash(
            password,
            15
        );

        // Update password

        await db.query(
            `UPDATE users
             SET password_hash = ?
             WHERE user_id = ?`,
            [
                hashedPassword,
                id,
            ]
        );

        // Revoke refresh tokens
        // This forces the user to authenticate again after an admin resets their password.
        await db.query(
            `DELETE FROM refresh_tokens
             WHERE user_id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "User password reset successfully.",
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// Change Individual User Password (Admin changes another user's password.)
const changeUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const passwordError =
            validatePassword(newPassword);

        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError,
            });
        }

        // Check user exists
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            15
        );

        // Update password
        await db.query(
            `UPDATE users
             SET password_hash = ?
             WHERE user_id = ?`,
            [
                hashedPassword,
                id,
            ]
        );

        // Revoke refresh tokens
        await db.query(
            `DELETE FROM refresh_tokens
             WHERE user_id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "User password changed successfully.",
        });

    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self deletion
        if (Number(id) === Number(req.user.user_id)) {
            return res.status(400).json({ message: "You cannot delete your own account while logged in." });
        }

        // Check user exists
        const [users] = await db.query(
            `SELECT user_id
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Remove refresh tokens first because they reference the user table.
        await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [id]);

        const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

module.exports = { createUser, getAllUsers, updateUser, updateUserStatus, resetUserPassword, changeUserPassword, deleteUser };
