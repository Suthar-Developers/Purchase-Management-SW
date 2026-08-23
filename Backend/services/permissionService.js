const db = require("../config/db");
const { normalizeRole } = require("../constants/roles");
const { getRoleDefaultPermissions, normalizePermissions, rowsToPermissions } = require("../constants/permissions");

const isAdminRole = (role) => normalizeRole(role) === normalizeRole("Admin");

const getSavedPermissionRows = async (userId) => {
    const [rows] = await db.query(
        `SELECT module_key, action_key, can_access
         FROM user_permissions
         WHERE user_id = ?`,
        [userId]
    );

    return rows;
};

const getEffectivePermissionsForUser = async (user) => {
    if (isAdminRole(user?.role)) {
        return normalizePermissions(getRoleDefaultPermissions("Admin"));
    }

    const rows = await getSavedPermissionRows(user.user_id);

    if (rows.length === 0) {
        return normalizePermissions(getRoleDefaultPermissions(user.role));
    }

    return rowsToPermissions(rows);
};

const getUserPermissions = async (userId) => {
    const [users] = await db.query(
        `SELECT user_id, full_name, username, role
         FROM users
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    if (users.length === 0) {
        return null;
    }

    const savedRows = await getSavedPermissionRows(userId);
    const hasCustomPermissions = savedRows.length > 0;
    const permissions = hasCustomPermissions
        ? rowsToPermissions(savedRows)
        : await getEffectivePermissionsForUser(users[0]);

    return {
        user: users[0],
        permissions,
        hasCustomPermissions,
    };
};

const saveUserPermissions = async (userId, permissions = {}) => {
    const normalized = normalizePermissions(permissions);
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        await connection.query("DELETE FROM user_permissions WHERE user_id = ?", [userId]);

        const rows = [];
        Object.entries(normalized).forEach(([moduleKey, actions]) => {
            Object.entries(actions).forEach(([actionKey, allowed]) => {
                rows.push([userId, moduleKey, actionKey, allowed ? 1 : 0]);
            });
        });

        if (rows.length > 0) {
            await connection.query(
                `INSERT INTO user_permissions (user_id, module_key, action_key, can_access)
                 VALUES ?`,
                [rows]
            );
        }

        await connection.commit();
        return normalized;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const userHasPermission = async (user, moduleKey, actionKey = "view") => {
    if (isAdminRole(user?.role)) {
        return true;
    }

    const permissions = await getEffectivePermissionsForUser(user);
    return Boolean(permissions?.[moduleKey]?.[actionKey]);
};

module.exports = {
    getEffectivePermissionsForUser,
    getUserPermissions,
    isAdminRole,
    saveUserPermissions,
    userHasPermission,
};
