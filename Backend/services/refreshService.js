const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("../utils/generateToken");

const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw {
            status: 401,
            message: "Refresh token missing"
        };
    }

    const payload = jwt.verifyRefreshToken(refreshToken);

    const [rows] = await db.query(
        "SELECT * FROM refresh_tokens WHERE jti = ? AND revoked_at IS NULL",
        [payload.jti]
    );

    if (rows.length === 0) {
        throw {
            status: 401,
            message: "Session expired"
        };
    }

    const storedToken = rows[0];

    // Compare Token Hash
    const valid = await bcrypt.compare(
        refreshToken,
        storedToken.token_hash
    );

    if (!valid) {
        throw {
            status: 401,
            message: "Invalid refresh token"
        };
    }

    const [users] = await db.query(
        "SELECT * FROM users WHERE user_id=?",
        [payload.id]
    );

    if (users.length === 0) {
        throw {
            status: 401,
            message: "User not found"
        };
    }

    const user = users[0];

    // Revoke Old Refresh Token
    await db.query(
        `UPDATE refresh_tokens SET revoked_at = NOW() WHERE jti = ?`,
        [payload.jti]
    );

    const newAccessToken = jwt.generateAccessToken(user);

    const newRefresh = jwt.generateRefreshToken(user);

    // Hash New Refresh Token
    const hashedRefreshToken = await bcrypt.hash(
        newRefresh.token,
        10
    );

    const expiresAt = new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000
    );

    // Store New Refresh Token
    await db.query(
        `INSERT INTO refresh_tokens
        (jti, user_id, token_hash, expires_at)
        VALUES (?, ?, ?, ?)`,
        [newRefresh.jti, user.user_id, hashedRefreshToken, expiresAt]
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefresh.token,
        user
    };

}

module.exports = { refresh };