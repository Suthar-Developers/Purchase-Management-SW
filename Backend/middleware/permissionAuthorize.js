const { userHasPermission } = require("../services/permissionService");

const permissionAuthorize = (moduleKey, actionKey = "view") => async (req, res, next) => {
    try {
        const allowed = await userHasPermission(req.user, moduleKey, actionKey);

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    } catch (error) {
        console.error("Permission check error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to check permissions.",
        });
    }
};

module.exports = permissionAuthorize;
