const db = require("../config/db");
const jwt = require("../utils/generateToken");

const logout = async (refreshToken) => {

    if (!refreshToken) {
        return;
    }

    try {
        const payload = jwt.verifyRefreshToken(refreshToken);

        await db.query(
            `UPDATE refresh_tokens
             SET revoked_at = NOW()
             WHERE jti = ?`,
            [payload.jti]
        );

    } catch (err) {
        // Ignore invalid or expired refresh tokens.
        // Logout should still succeed from the user's perspective.
    }
};

module.exports = {
    logout
};