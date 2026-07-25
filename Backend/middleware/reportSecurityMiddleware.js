// Roles allowed to use Reports. Add/remove role names here when RBAC changes.
const REPORT_ROLES = new Set(['admin', 'manager', 'purchase_manager', 'finance', 'reports']);

const reportsAuth = (req, res, next) => {
    // Temporary auth bridge: reads user details from headers.
    // Replace this with your real JWT middleware when the main app auth is ready.
    const authHeader = req.headers.authorization;

    req.user = {
        id: req.headers['x-user-id'] || 'system',
        role: req.headers['x-user-role'] || 'admin',
        name: req.headers['x-user-name'] || 'System User'
    };

    if (process.env.REPORTS_REQUIRE_AUTH === 'true' && !authHeader) {
        // Keep REPORTS_REQUIRE_AUTH=false during local development if no JWT is available.
        return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    return next();
};

const reportsAuthorize = (allowedRoles = REPORT_ROLES) => (req, res, next) => {
    // Role guard for all /api/reports endpoints.
    if (!allowedRoles.has(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You do not have permission to access reports' });
    }

    return next();
};

const reportsRateLimit = (limit = 240, windowMs = 60000) => {
    // In-memory rate limiter to protect expensive report queries.
    // For multi-server production, move this to Redis or another shared store.
    const hits = new Map();

    return (req, res, next) => {
        const key = `${req.ip}:${req.user?.id || 'anonymous'}`;
        const now = Date.now();
        const bucket = hits.get(key) || { count: 0, resetAt: now + windowMs };

        if (now > bucket.resetAt) {
            bucket.count = 0;
            bucket.resetAt = now + windowMs;
        }

        bucket.count += 1;
        hits.set(key, bucket);

        if (bucket.count > limit) {
            return res.status(429).json({ success: false, message: 'Too many report requests. Please try again shortly.' });
        }

        return next();
    };
};

module.exports = { reportsAuth, reportsAuthorize, reportsRateLimit, REPORT_ROLES };