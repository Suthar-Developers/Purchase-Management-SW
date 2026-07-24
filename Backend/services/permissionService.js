const db = require('../config/db');
const cache = new Map();
const TTL = 60_000;

const effectivePermissions = async (userId) => {
  const cached = cache.get(userId);
  if (cached?.expiresAt > Date.now()) return cached.value;
  const [rows] = await db.query(`
    SELECT p.permission_key, COALESCE(up.effect,rp.effect) effect
    FROM users u
    JOIN role_permissions rp ON rp.role_id=u.role_ref_id
    JOIN permissions p ON p.permission_id=rp.permission_id AND p.is_active=1
    LEFT JOIN user_permissions up ON up.user_id=u.user_id AND up.permission_id=p.permission_id
    WHERE u.user_id=?
    UNION
    SELECT p.permission_key, up.effect FROM user_permissions up JOIN permissions p ON p.permission_id=up.permission_id WHERE up.user_id=?`, [userId, userId]);
  const value = [...new Set(rows.filter((r) => r.effect === 'allow').map((r) => r.permission_key))].filter((key) => !rows.some((r) => r.permission_key === key && r.effect === 'deny'));
  cache.set(userId, { value, expiresAt: Date.now() + TTL });
  return value;
};
const invalidate = (userId) => cache.delete(userId);
const snapshot = async (userId) => {
  const [fields] = await db.query(`SELECT module_key,field_key,access_level FROM field_policies WHERE (subject_type='role' AND subject_id=(SELECT role_ref_id FROM users WHERE user_id=?)) OR (subject_type='user' AND subject_id=?)`, [userId,userId]);
  const [scopes] = await db.query(`SELECT module_key,scope FROM data_scope_policies WHERE (subject_type='role' AND subject_id=(SELECT role_ref_id FROM users WHERE user_id=?)) OR (subject_type='user' AND subject_id=?)`, [userId,userId]);
  return { permissions: await effectivePermissions(userId), fields, scopes };
};
module.exports = { effectivePermissions, invalidate, snapshot };
