const REPORT_MODULES = require('../constants/reportModules');
const reportRepository = require('../repositories/reportRepository');
const preferenceRepository = require('../repositories/reportPreferenceRepository');
const { buildInsights } = require('./reportInsightsService');

const getModules = async (userId) => {
    const favorites = await preferenceRepository.getFavorites(userId);
    return REPORT_MODULES.map((module) => ({ ...module, favorite: favorites.includes(module.id) }));
};

const getOverview = async (filters) => reportRepository.getOverview(filters);

const getReport = async (reportId, filters) => {
    const module = REPORT_MODULES.find((item) => item.id === reportId);
    if (!module) {
        const err = new Error('Report module not found');
        err.statusCode = 404;
        err.code = 'REPORT_NOT_FOUND';
        throw err;
    }

    const [overview, analytics, table] = await Promise.all([
        reportRepository.getOverview(filters),
        reportRepository.getReportAnalytics(reportId, filters),
        reportRepository.getReportRows(reportId, filters)
    ]);

    return {
        module,
        overview,
        analytics,
        table,
        insights: buildInsights({ overview, analytics })
    };
};

const getFilterOptions = () => reportRepository.getFilterOptions();

const getPreferences = async (userId) => {
    const [savedFilters, templates, schedules, alerts, favorites, auditLogs] = await Promise.all([
        preferenceRepository.list('savedFilters', userId),
        preferenceRepository.list('templates', userId),
        preferenceRepository.list('schedules', userId),
        preferenceRepository.list('alerts', userId),
        preferenceRepository.getFavorites(userId),
        preferenceRepository.getAuditLogs(userId)
    ]);
    return { savedFilters, templates, schedules, alerts, favorites, auditLogs };
};

const savePreference = (collection, userId, payload) => preferenceRepository.save(collection, userId, payload);
const removePreference = (collection, userId, id) => preferenceRepository.remove(collection, userId, id);
const toggleFavorite = (userId, reportId) => preferenceRepository.toggleFavorite(userId, reportId);
const audit = (userId, action, metadata) => preferenceRepository.addAuditLog(userId, action, metadata);

module.exports = {
    getModules,
    getOverview,
    getReport,
    getFilterOptions,
    getPreferences,
    savePreference,
    removePreference,
    toggleFavorite,
    audit
};
