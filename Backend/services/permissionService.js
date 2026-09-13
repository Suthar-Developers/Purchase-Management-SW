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

const getSavedRolePermissionRows = async (role) => {
    const [rows] = await db.query(
        `SELECT module_key, action_key, can_access
         FROM role_permissions
         WHERE LOWER(role_name) = LOWER(?)`,
        [String(role || "").trim()]
    );

    return rows;
};

const mergePermissions = (...permissionSets) => {
    const merged = normalizePermissions();

    permissionSets.forEach((permissionSet) => {
        const normalized = normalizePermissions(permissionSet);

        Object.entries(normalized).forEach(([moduleKey, actions]) => {
            Object.entries(actions).forEach(([actionKey, allowed]) => {
                merged[moduleKey][actionKey] = Boolean(merged[moduleKey][actionKey] || allowed);
            });
        });
    });

    return merged;
};

const getRolePermissions = async (role) => {
    if (isAdminRole(role)) {
        return normalizePermissions(getRoleDefaultPermissions("Admin"));
    }

    const rows = await getSavedRolePermissionRows(role);

    if (rows.length === 0) {
        return normalizePermissions(getRoleDefaultPermissions(role));
    }

    return rowsToPermissions(rows);
};

const getEffectivePermissionsForUser = async (user) => {
    if (isAdminRole(user?.role)) {
        return normalizePermissions(getRoleDefaultPermissions("Admin"));
    }

    const rolePermissions = await getRolePermissions(user.role);
    const userExtraPermissions = rowsToPermissions(await getSavedPermissionRows(user.user_id));

    return mergePermissions(rolePermissions, userExtraPermissions);
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
    const rolePermissions = await getRolePermissions(users[0].role);
    const extraPermissions = rowsToPermissions(savedRows);
    const permissions = mergePermissions(rolePermissions, extraPermissions);

    return {
        user: users[0],
        permissions,
        rolePermissions,
        extraPermissions,
        hasCustomPermissions: savedRows.length > 0,
    };
};

const saveRolePermissions = async (role, permissions = {}) => {
    const normalized = normalizePermissions(permissions);
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        await connection.query("DELETE FROM role_permissions WHERE LOWER(role_name) = LOWER(?)", [String(role || "").trim()]);

        const rows = [];
        Object.entries(normalized).forEach(([moduleKey, actions]) => {
            Object.entries(actions).forEach(([actionKey, allowed]) => {
                rows.push([role, moduleKey, actionKey, allowed ? 1 : 0]);
            });
        });

        if (rows.length > 0) {
            await connection.query(
                `INSERT INTO role_permissions (role_name, module_key, action_key, can_access)
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
    getRolePermissions,
    getUserPermissions,
    isAdminRole,
    saveRolePermissions,
    saveUserPermissions,
    userHasPermission,
};
