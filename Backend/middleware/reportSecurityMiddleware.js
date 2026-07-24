const authenticate = require('./authenticate');
const { requirePermission } = require('./requirePermission');
const rateLimit = require('express-rate-limit');
// Compatibility exports used by reportRoute. Client supplied headers are never trusted.
const reportsAuth = authenticate;
const reportsAuthorize = () => requirePermission('report.view');
const reportsRateLimit = () => rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false });
module.exports = { reportsAuth, reportsAuthorize, reportsRateLimit, REPORT_ROLES: new Set() };
