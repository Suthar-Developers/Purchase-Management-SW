const { normalizeRole } = require("../constants/roles");

module.exports = (...roles) => {
    return (req, res, next) => {
        const userRole = normalizeRole(req.user.role);

        // Normalize allowed roles too, so authorize(1) and authorize("Admin") both work.
        const allowedRoles = roles.map((role) => normalizeRole(role));

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        next();
    };
};
