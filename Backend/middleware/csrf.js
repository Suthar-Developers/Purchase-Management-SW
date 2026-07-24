const { randomToken, csrfCookieOptions } = require('../utils/security');
const CSRF_COOKIE = process.env.CSRF_COOKIE_NAME || 'pm_csrf';

const issueCsrfToken = (req, res) => {
  const token = randomToken();
  res.cookie(CSRF_COOKIE, token, csrfCookieOptions());
  res.status(200).json({ csrfToken: token });
};

const csrfProtection = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get('x-csrf-token');
  if (!cookie || !header || cookie !== header) return res.status(403).json({ code: 'CSRF_INVALID', message: 'Invalid CSRF token' });
  return next();
};

module.exports = { issueCsrfToken, csrfProtection, CSRF_COOKIE };
