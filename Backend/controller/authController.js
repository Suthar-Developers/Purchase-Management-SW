const authService = require("../services/authService");
const refreshService = require("../services/refreshService");
const logoutService = require("../services/logoutService")
const db = require("../config/db");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const {
            accessToken,
            refreshToken,
            user
        } = await authService.login(username, password);

        res.cookie(process.env.COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user.user_id,
                full_name: user.full_name,
                username: user.username,
                role_id: user.role_id
            }
        })

    } catch (err) {

        return res.status(err.status || 500).json({
            message: err.message || "Internal server error"
        });
    }
}

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies[process.env.COOKIE_NAME];

        const response = await refreshService.refresh(refreshToken);

        res.cookie(
            process.env.COOKIE_NAME,
            response.refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );

        return res.json({
            accessToken: response.accessToken,

            user: {
                id: response.user.user_id,
                username: response.user.username,
                full_name: response.user.full_name,
                role_id: response.user.role_id
            }
        });
    }

    catch (err) {
        return res.status(err.status || 500).json({
            message: err.message
        });
    }

}

const logout = async (req, res) => {

    try {
        const refreshToken = req.cookies[process.env.COOKIE_NAME];

        await logoutService.logout(refreshToken);

        res.clearCookie(process.env.COOKIE_NAME, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.json({
            message: "Logout successful"
        });

    } catch (err) {
        return res.status(500).json({
            message: "Logout failed"
        });
    }
};

const me = async (req, res) => {
    try {
        const userId = req.user.id ?? req.user.user_id;
        const [rows] = await db.query(
            `SELECT user_id, username, full_name, role_id FROM users WHERE user_id = ? LIMIT 1`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const user = rows[0];

        return res.status(200).json({
            success: true,
            user: {
                id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                role_id: user.role_id,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch user",
        });
    }
};

module.exports = { login, refresh, logout, me };
