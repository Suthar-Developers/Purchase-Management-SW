const authService = require("../services/authService");
const refreshService = require("../services/refreshService");

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
        const token = req.cookies.refreshToken;

        const response = await refreshService.refresh(token);

        res.cookie(
            process.env.COOKIE_NAME,
            response.refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:
                    7 * 24 * 60 * 60 * 1000
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

module.exports = { login, refresh };