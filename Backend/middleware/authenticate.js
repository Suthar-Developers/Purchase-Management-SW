const db = require('../config/db');
const token = require('../utils/generateToken');
const ACCESS_COOKIE = process.env.ACCESS_COOKIE_NAME || 'pm_access';

module.exports = async (req, res, next) => {
  try {
    const jwt = req.cookies?.[ACCESS_COOKIE];
    if (!jwt) return res.status(401).json({ code: 'AUTH_REQUIRED', message: 'Authentication required' });
    const payload = token.verifyAccessToken(jwt);
    const [rows] = await db.query(`SELECT u.user_id,u.username,u.full_name,u.status,u.role_ref_id,u.company_id,u.branch_id,u.department_id,u.permission_version,r.role_key,r.name role_name,s.session_id FROM users u JOIN roles r ON r.role_id=u.role_ref_id JOIN sessions s ON s.session_id=? WHERE u.user_id=? AND s.user_id=? AND s.terminated_at IS NULL AND s.expires_at>NOW()`, [payload.sid,payload.sub,payload.sub]);
    if (!rows.length || !['active','force_password_reset'].includes(rows[0].status)) return res.status(401).json({ code: 'SESSION_INVALID', message: 'Session is no longer active' });
    req.user = rows[0];
    db.query('UPDATE sessions SET last_activity_at=NOW() WHERE session_id=?', [payload.sid]).catch(() => {});
    next();
  } catch (error) { return res.status(401).json({ code: 'AUTH_INVALID', message: 'Authentication required' }); }
};
