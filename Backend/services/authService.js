const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const jwt = require('../utils/generateToken');
const { clientIp } = require('../utils/security');

const expiresAt = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const device = (ua = '') => ({ deviceName: ua.slice(0, 160) || 'Unknown device', browser: /Firefox/i.test(ua) ? 'Firefox' : /Edg/i.test(ua) ? 'Edge' : /Chrome/i.test(ua) ? 'Chrome' : 'Unknown', os: /Windows/i.test(ua) ? 'Windows' : /Mac OS/i.test(ua) ? 'macOS' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS' : 'Unknown' });
const safeUser = (user) => ({ id: user.user_id, username: user.username, fullName: user.full_name, role: { key: user.role_key, name: user.role_name }, status: user.status, forcePasswordChange: Boolean(user.force_password_change) });
const recordAttempt = (username, userId, req, wasSuccessful) => db.query('INSERT INTO login_attempts(username,user_id,ip_address,user_agent,was_successful) VALUES (?,?,?,?,?)', [username,userId || null,clientIp(req),req.get('user-agent') || null,wasSuccessful]);

const login = async (username, password, req) => {
  const [users] = await db.query(`SELECT u.*,r.role_key,r.name role_name FROM users u LEFT JOIN roles r ON r.role_id=u.role_ref_id WHERE u.username=?`, [username]);
  const user = users[0];
  const [failures] = await db.query(`SELECT COUNT(*) count FROM login_attempts WHERE username=? AND was_successful=0 AND attempted_at > DATE_SUB(NOW(),INTERVAL 15 MINUTE)`, [username]);
  if (Number(failures[0].count) >= 5) { await recordAttempt(username,user?.user_id,req,false); throw { status: 423, code: 'ACCOUNT_LOCKED', message: 'Account temporarily locked' }; }
  if (!user || !await bcrypt.compare(password, user.password_hash)) { await recordAttempt(username,user?.user_id,req,false); throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }; }
  if (['inactive','blocked','deleted','locked','password_expired'].includes(user.status)) { await recordAttempt(username,user.user_id,req,false); throw { status: 403, code: 'ACCOUNT_UNAVAILABLE', message: 'Account is not available' }; }
  const ua = req.get('user-agent') || '';
  const [known] = await db.query(`SELECT session_id FROM sessions WHERE user_id=? AND ip_address=? AND user_agent=? AND terminated_at IS NULL LIMIT 1`, [user.user_id,clientIp(req),ua]);
  if (!known.length) await db.query(`INSERT INTO security_events(user_id,event_type,severity,ip_address,user_agent,details) VALUES(?,?,?,?,?,?)`, [user.user_id,'NEW_DEVICE_LOGIN','low',clientIp(req),ua,JSON.stringify({ username })]);
  const sessionId = uuid(), familyId = uuid(), refresh = jwt.generateRefreshToken(user,sessionId,familyId), meta=device(ua);
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); await connection.query(`INSERT INTO sessions(session_id,user_id,token_family_id,ip_address,user_agent,device_name,browser,os,login_at,last_activity_at,expires_at) VALUES(?,?,?,?,?,?,?,?,NOW(),NOW(),?)`, [sessionId,user.user_id,familyId,clientIp(req),ua,meta.deviceName,meta.browser,meta.os,expiresAt()]); await connection.query(`INSERT INTO refresh_tokens(jti,user_id,token_hash,expires_at,session_id,token_family_id) VALUES(?,?,?,?,?,?)`, [refresh.jti,user.user_id,await bcrypt.hash(refresh.token,12),expiresAt(),sessionId,familyId]); await connection.commit(); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
  await recordAttempt(username,user.user_id,req,true);
  return { accessToken: jwt.generateAccessToken(user,sessionId), refreshToken: refresh.token, user: safeUser(user), sessionId };
};
module.exports = { login, safeUser };
