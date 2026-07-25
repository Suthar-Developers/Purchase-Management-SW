const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('../utils/generateToken')

const login = async (username, password) => {

    const [rows] = await db.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
    )

    if (rows.length === 0) {
        throw {
            status: 401,
            message: "Invalid username or password"
        };
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        throw {
            status: 401,
            message: "Invalid username or password"
        };
    }

    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken.token, 10);

    await db.query(
        `INSERT INTO refresh_tokens
        (jti, user_id, token_hash, expires_at)
        VALUES(?,?,?,?)`,
        [
            refreshToken.jti,
            user.user_id,
            hashedRefreshToken,
            expiresAt
        ]);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken.token,
        user
    };

}

module.exports = { login };