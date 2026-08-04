const db = require('../config/db');

module.exports = (...roles) => {
    return async (req, res, next) => {
        const normalizeRole = (role) => String(role ?? '').trim().toLowerCase();
        const tokenRole = normalizeRole(req.user.role_id ?? req.user.role);
        const allowedRoles = roles.map(normalizeRole);
        const adminRoles = ['1', 'admin', 'administrator', 'super admin'];
        const isRoleAllowed = (role) => allowedRoles.includes(role) || (allowedRoles.includes('1') && adminRoles.includes(role));

        try {
            if (isRoleAllowed(tokenRole)) {
                return next();
            }

            const userId = req.user.id ?? req.user.user_id;

            if (userId) {
                const [rows] = await db.query(
                    `SELECT role_id FROM users WHERE user_id = ? LIMIT 1`,
                    [userId]
                );
                const databaseRole = normalizeRole(rows[0]?.role_id);

                if (isRoleAllowed(databaseRole)) {
                    return next();
                }
            }

            return res.status(403).json({
                message: "Access denied."
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server error"
            });
        }
    };
};
