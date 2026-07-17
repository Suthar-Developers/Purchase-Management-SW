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

    const payload =
        jwt.verifyRefreshToken(refreshToken);

    const [rows] = await db.query(
        "SELECT * FROM refresh_tokens WHERE user_id=? AND revoked_at IS NULL",
        [payload.id]
    );

    if (rows.length === 0) {
        throw {
            status: 401,
            message: "Session expired"
        };
    }

    let valid = false;

    for (const row of rows) {
        const match =
            await bcrypt.compare(
                refreshToken,
                row.token_hash
            );

        if (match) {
            valid = true;
            break;
        }
    }

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

    const user = users[0];

    const newAccessToken = jwt.createAccessToken(user);

    const newRefreshToken = jwt.createRefreshToken(user);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user
    };

}

module.exports = { refresh };