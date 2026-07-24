const { effectivePermissions } = require('../services/permissionService');
const requirePermission = (...permissions) => async (req, res, next) => {
  try {
    const granted = await effectivePermissions(req.user.user_id);
    if (!permissions.every((permission) => granted.includes(permission))) return res.status(403).json({ code: 'FORBIDDEN', message: 'You do not have permission to perform this action' });
    req.permissions = granted;
    next();
  } catch (error) { next(error); }
};
const requireModule = (moduleKey) => requirePermission(`${moduleKey}.view`);
module.exports = { requirePermission, requireModule };
