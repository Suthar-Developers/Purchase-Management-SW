const db = require('../config/db');

const fallbackStore = {
    savedFilters: [],
    templates: [],
    schedules: [],
    alerts: [],
    auditLogs: [],
    favorites: new Set()
};

const tableConfig = {
    savedFilters: {
        table: 'report_saved_filters',
        idColumn: 'filter_id',
        toRow: (userId, payload) => [userId, payload.name, payload.reportId || null, payload.visibility || 'private', JSON.stringify(payload.filters || {})],
        insert: 'INSERT INTO report_saved_filters (user_id, name, report_id, visibility, filters) VALUES (?, ?, ?, ?, ?)',
        select: 'SELECT filter_id id, user_id userId, name, report_id reportId, visibility, filters, created_at createdAt, updated_at updatedAt FROM report_saved_filters WHERE user_id = ? OR visibility = "shared" ORDER BY updated_at DESC'
    },
    templates: {
        table: 'report_templates',
        idColumn: 'template_id',
        toRow: (userId, payload) => [userId, payload.name, payload.reportId, JSON.stringify(payload.columns || []), JSON.stringify(payload.filters || {}), JSON.stringify(payload.grouping || []), JSON.stringify(payload.aggregations || []), payload.visibility || 'private'],
        insert: 'INSERT INTO report_templates (user_id, name, report_id, columns, filters, grouping, aggregations, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT template_id id, user_id userId, name, report_id reportId, columns, filters, grouping, aggregations, visibility, version, created_at createdAt, updated_at updatedAt FROM report_templates WHERE user_id = ? OR visibility = "shared" ORDER BY updated_at DESC'
    },
    schedules: {
        table: 'report_schedules',
        idColumn: 'schedule_id',
        toRow: (userId, payload) => [userId, payload.reportId, payload.name, payload.frequency, JSON.stringify(payload.recipients || []), payload.export_format || 'pdf', JSON.stringify(payload.filters || {}), payload.next_run_at || null],
        insert: 'INSERT INTO report_schedules (user_id, report_id, name, frequency, recipients, export_format, filters, next_run_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT schedule_id id, user_id userId, report_id reportId, name, frequency, recipients, export_format exportFormat, filters, is_active isActive, next_run_at nextRunAt, created_at createdAt, updated_at updatedAt FROM report_schedules WHERE user_id = ? ORDER BY updated_at DESC'
    },
    alerts: {
        table: 'report_threshold_alerts',
        idColumn: 'alert_id',
        toRow: (userId, payload) => [userId, payload.reportId, payload.name, payload.metric, payload.operator, payload.threshold_value, payload.severity || 'medium', JSON.stringify(payload.recipients || [])],
        insert: 'INSERT INTO report_threshold_alerts (user_id, report_id, name, metric, operator, threshold_value, severity, recipients) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT alert_id id, user_id userId, report_id reportId, name, metric, operator, threshold_value thresholdValue, severity, recipients, is_active isActive, created_at createdAt, updated_at updatedAt FROM report_threshold_alerts WHERE user_id = ? ORDER BY updated_at DESC'
    }
};

const stamp = () => new Date().toISOString();
const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const parseJson = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const normalizeRows = (collection, rows) => rows.map((row) => {
    if (collection === 'savedFilters') return { ...row, filters: parseJson(row.filters, {}) };
    if (collection === 'templates') return { ...row, columns: parseJson(row.columns, []), filters: parseJson(row.filters, {}), grouping: parseJson(row.grouping, []), aggregations: parseJson(row.aggregations, []) };
    if (collection === 'schedules') return { ...row, recipients: parseJson(row.recipients, []), filters: parseJson(row.filters, {}) };
    if (collection === 'alerts') return { ...row, recipients: parseJson(row.recipients, []) };
    return row;
});

const fallbackList = (collection, userId) => fallbackStore[collection].filter((item) => item.userId === userId || item.visibility === 'shared');

const fallbackSave = (collection, userId, payload) => {
    const record = {
        id: payload.id || createId(collection),
        userId,
        createdAt: payload.createdAt || stamp(),
        updatedAt: stamp(),
        ...payload
    };
    const index = fallbackStore[collection].findIndex((item) => item.id === record.id && item.userId === userId);
    if (index >= 0) fallbackStore[collection][index] = record;
    else fallbackStore[collection].push(record);
    return record;
};

const list = async (collection, userId) => {
    const config = tableConfig[collection];
    if (!config) return [];
    try {
        const [rows] = await db.query(config.select, [userId]);
        return normalizeRows(collection, rows);
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        return fallbackList(collection, userId);
    }
};

const save = async (collection, userId, payload) => {
    const config = tableConfig[collection];
    if (!config) return fallbackSave(collection, userId, payload);
    try {
        const [result] = await db.query(config.insert, config.toRow(userId, payload));
        return { id: result.insertId, userId, createdAt: stamp(), updatedAt: stamp(), ...payload };
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        return fallbackSave(collection, userId, payload);
    }
};

const remove = async (collection, userId, id) => {
    const config = tableConfig[collection];
    if (!config) return false;
    try {
        const [result] = await db.query(`DELETE FROM ${config.table} WHERE ${config.idColumn} = ? AND user_id = ?`, [id, userId]);
        return result.affectedRows > 0;
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        const before = fallbackStore[collection].length;
        fallbackStore[collection] = fallbackStore[collection].filter((item) => !(item.id === id && item.userId === userId));
        return before !== fallbackStore[collection].length;
    }
};

const getFavorites = async (userId) => {
    try {
        const [rows] = await db.query('SELECT report_id reportId FROM report_favorites WHERE user_id = ?', [userId]);
        return rows.map((row) => row.reportId);
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        return [...fallbackStore.favorites].filter((key) => key.startsWith(`${userId}:`)).map((key) => key.split(':')[1]);
    }
};

const toggleFavorite = async (userId, reportId) => {
    try {
        const [existing] = await db.query('SELECT favorite_id FROM report_favorites WHERE user_id = ? AND report_id = ?', [userId, reportId]);
        if (existing.length) {
            await db.query('DELETE FROM report_favorites WHERE user_id = ? AND report_id = ?', [userId, reportId]);
            return { reportId, favorite: false };
        }
        await db.query('INSERT INTO report_favorites (user_id, report_id) VALUES (?, ?)', [userId, reportId]);
        return { reportId, favorite: true };
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        const key = `${userId}:${reportId}`;
        if (fallbackStore.favorites.has(key)) {
            fallbackStore.favorites.delete(key);
            return { reportId, favorite: false };
        }
        fallbackStore.favorites.add(key);
        return { reportId, favorite: true };
    }
};

const addAuditLog = async (userId, action, metadata = {}) => {
    try {
        const [result] = await db.query(
            'INSERT INTO report_audit_logs (user_id, action, report_id, metadata) VALUES (?, ?, ?, ?)',
            [userId, action, metadata.reportId || null, JSON.stringify(metadata)]
        );
        return { id: result.insertId, userId, action, metadata, createdAt: stamp() };
    } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
        const record = { id: createId('audit'), userId, action, metadata, createdAt: stamp() };
        fallbackStore.auditLogs.unshift(record);
        fallbackStore.auditLogs = fallbackStore.auditLogs.slice(0, 500);
        return record;
    }
};

module.exports = { list, save, remove, toggleFavorite, getFavorites, addAuditLog };
