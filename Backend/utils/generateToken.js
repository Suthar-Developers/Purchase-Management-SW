const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES || '7d';

exports.generateAccessToken = (user, sessionId) => jwt.sign({ sub: user.user_id, sid: sessionId, pv: user.permission_version || 1 }, process.env.JWT_ACCESS_SECRET, { expiresIn: accessExpiry, issuer: 'purchase-management', audience: 'purchase-web' });
exports.generateRefreshToken = (user, sessionId, familyId) => {
  const jti = uuid();
  return { jti, token: jwt.sign({ sub: user.user_id, sid: sessionId, fid: familyId, jti }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiry, issuer: 'purchase-management', audience: 'purchase-web' }) };
};
exports.verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET, { issuer: 'purchase-management', audience: 'purchase-web' });
exports.verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET, { issuer: 'purchase-management', audience: 'purchase-web' });
