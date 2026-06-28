const express = require('express');
const reportController = require('../controller/reportController');
const reportErrorMiddleware = require('../middleware/reportErrorMiddleware');
const { reportsAuth, reportsAuthorize, reportsRateLimit, REPORT_ROLES } = require('../middleware/reportSecurityMiddleware');

const router = express.Router();

// Every reports endpoint passes through auth, role check, and light rate limiting.
router.use('/reports', reportsAuth, reportsAuthorize(REPORT_ROLES), reportsRateLimit());

router.get('/reports/modules', reportController.getModules);
router.get('/reports/overview', reportController.getOverview);
router.get('/reports/filter-options', reportController.getFilterOptions);
router.get('/reports/preferences', reportController.getPreferences);

// Keep this dynamic route after fixed routes like /preferences and /filter-options.
router.get('/reports/:reportId', reportController.getReport);

router.post('/reports/saved-filters', reportController.saveFilter);
router.post('/reports/templates', reportController.saveTemplate);
router.post('/reports/schedules', reportController.saveSchedule);
router.post('/reports/alerts', reportController.saveAlert);
router.post('/reports/favorites/:reportId', reportController.toggleFavorite);
router.delete('/reports/:collection/:id', reportController.deletePreference);

router.use(reportErrorMiddleware);

module.exports = router;
