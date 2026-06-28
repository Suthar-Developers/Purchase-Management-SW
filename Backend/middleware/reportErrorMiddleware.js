const reportErrorMiddleware = (err, req, res, next) => {
    // Centralized error response for report routes.
    // Keeps SQL/internal errors out of browser console while logging details on server.
    if (!err) return next();

    const status = err.statusCode || 500;
    const code = err.code || 'REPORTS_SERVER_ERROR';

    console.error(`[reports] ${code}`, err);

    return res.status(status).json({
        success: false,
        code,
        message: status === 500 ? 'Unable to process report request' : err.message
    });
};

module.exports = reportErrorMiddleware;
