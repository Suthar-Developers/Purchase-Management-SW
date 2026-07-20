module.exports = (...roles) => {
    return (req, res, next) => {
        const userRole = Number(req.user.role_id ?? req.user.role);
        const allowedRoles = roles.map((role) => Number(role));

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        next();
    };
};
