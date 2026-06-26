const reportService = require('../services/reportService');

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

const getModules = asyncHandler(async (req, res) => {
    const modules = await reportService.getModules(req.user.id);
    res.json({ success: true, data: modules });
});

const getOverview = asyncHandler(async (req, res) => {
    const data = await reportService.getOverview(req.query);
    await reportService.audit(req.user.id, 'REPORT_OVERVIEW_VIEWED', { filters: req.query });
    res.json({ success: true, data });
});

const getReport = asyncHandler(async (req, res) => {
    const data = await reportService.getReport(req.params.reportId, req.query);
    await reportService.audit(req.user.id, 'REPORT_VIEWED', { reportId: req.params.reportId, filters: req.query });
    res.json({ success: true, data });
});

const getFilterOptions = asyncHandler(async (req, res) => {
    const data = await reportService.getFilterOptions();
    res.json({ success: true, data });
});

const getPreferences = asyncHandler(async (req, res) => {
    res.json({ success: true, data: await reportService.getPreferences(req.user.id) });
});

const saveFilter = asyncHandler(async (req, res) => {
    const data = await reportService.savePreference('savedFilters', req.user.id, req.body);
    await reportService.audit(req.user.id, 'REPORT_FILTER_SAVED', { id: data.id, name: data.name });
    res.status(201).json({ success: true, data });
});

const saveTemplate = asyncHandler(async (req, res) => {
    const data = await reportService.savePreference('templates', req.user.id, req.body);
    await reportService.audit(req.user.id, 'REPORT_TEMPLATE_SAVED', { id: data.id, name: data.name });
    res.status(201).json({ success: true, data });
});

const saveSchedule = asyncHandler(async (req, res) => {
    const data = await reportService.savePreference('schedules', req.user.id, req.body);
    await reportService.audit(req.user.id, 'REPORT_SCHEDULE_SAVED', { id: data.id, name: data.name });
    res.status(201).json({ success: true, data });
});

const saveAlert = asyncHandler(async (req, res) => {
    const data = await reportService.savePreference('alerts', req.user.id, req.body);
    await reportService.audit(req.user.id, 'REPORT_ALERT_SAVED', { id: data.id, name: data.name });
    res.status(201).json({ success: true, data });
});

const deletePreference = asyncHandler(async (req, res) => {
    const removed = await reportService.removePreference(req.params.collection, req.user.id, req.params.id);
    res.json({ success: true, data: { removed } });
});

const toggleFavorite = asyncHandler(async (req, res) => {
    const data = await reportService.toggleFavorite(req.user.id, req.params.reportId);
    await reportService.audit(req.user.id, 'REPORT_FAVORITE_TOGGLED', data);
    res.json({ success: true, data });
});

module.exports = {
    getModules,
    getOverview,
    getReport,
    getFilterOptions,
    getPreferences,
    saveFilter,
    saveTemplate,
    saveSchedule,
    saveAlert,
    deletePreference,
    toggleFavorite
};
