const db = require("../config/db");
const jwt = require("../utils/generateToken");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verifyAccessToken(token);

    const [users] = await db.query(
      `SELECT
                user_id,
                username,
                full_name,
                role
             FROM users
             WHERE user_id = ?`,
      [payload.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = users[0];

    next();

  } catch (err) {
    console.error("JWT Error:", err);

    return res.status(401).json({
      message: err.message,
    });
  }
};

module.exports = authenticate;