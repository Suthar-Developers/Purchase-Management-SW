const express = require('express');
const reportController = require('../controller/reportController');
const reportErrorMiddleware = require('../middleware/reportErrorMiddleware');
const { reportsRateLimit } = require('../middleware/reportSecurityMiddleware');
const authenticate = require('../middleware/authenticate');
const permissionAuthorize = require('../middleware/permissionAuthorize');

const router = express.Router();

// Every reports endpoint passes through auth, role check, and light rate limiting.
router.use('/reports', authenticate, permissionAuthorize('reports', 'view'), reportsRateLimit());

router.get('/reports/modules', reportController.getModules);
router.get('/reports/overview', reportController.getOverview);
router.get('/reports/filter-options', reportController.getFilterOptions);
router.get('/reports/preferences', reportController.getPreferences);

// Keep this dynamic route after fixed routes like /preferences and /filter-options.
router.get('/reports/:reportId', reportController.getReport);

router.post('/reports/saved-filters', permissionAuthorize('reports', 'create'), reportController.saveFilter);
router.post('/reports/templates', permissionAuthorize('reports', 'create'), reportController.saveTemplate);
router.post('/reports/schedules', permissionAuthorize('reports', 'create'), reportController.saveSchedule);
router.post('/reports/alerts', permissionAuthorize('reports', 'create'), reportController.saveAlert);
router.post('/reports/favorites/:reportId', permissionAuthorize('reports', 'edit'), reportController.toggleFavorite);
router.delete('/reports/:collection/:id', permissionAuthorize('reports', 'delete'), reportController.deletePreference);

router.use(reportErrorMiddleware);

module.exports = router;
