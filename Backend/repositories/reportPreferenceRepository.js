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
        select: 'SELECT filter_id AS id, user_id AS userId, name, report_id AS reportId, visibility, filters, created_at AS createdAt, updated_at AS updatedAt FROM report_saved_filters WHERE user_id = ? OR visibility = "shared" ORDER BY updated_at DESC',
        create: `CREATE TABLE IF NOT EXISTS report_saved_filters (
            filter_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            name VARCHAR(120) NOT NULL,
            report_id VARCHAR(80),
            visibility ENUM('private', 'shared') DEFAULT 'private',
            filters LONGTEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_report_saved_filters_user (user_id)
        )`
    },
    templates: {
        table: 'report_templates',
        idColumn: 'template_id',
        toRow: (userId, payload) => [userId, payload.name, payload.reportId, JSON.stringify(payload.columns || []), JSON.stringify(payload.filters || {}), JSON.stringify(payload.grouping || []), JSON.stringify(payload.aggregations || []), payload.visibility || 'private'],
        insert: 'INSERT INTO report_templates (user_id, name, report_id, `columns`, filters, `grouping`, aggregations, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT template_id AS id, user_id AS userId, name, report_id AS reportId, `columns`, filters, `grouping`, aggregations, visibility, version, created_at AS createdAt, updated_at AS updatedAt FROM report_templates WHERE user_id = ? OR visibility = "shared" ORDER BY updated_at DESC',
        create: `CREATE TABLE IF NOT EXISTS report_templates (
            template_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            name VARCHAR(120) NOT NULL,
            report_id VARCHAR(80) NOT NULL,
            \`columns\` LONGTEXT NOT NULL,
            filters LONGTEXT,
            \`grouping\` LONGTEXT,
            aggregations LONGTEXT,
            visibility ENUM('private', 'shared') DEFAULT 'private',
            version INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_report_templates_user (user_id)
        )`
    },
    schedules: {
        table: 'report_schedules',
        idColumn: 'schedule_id',
        toRow: (userId, payload) => [userId, payload.reportId, payload.name, payload.frequency, JSON.stringify(payload.recipients || []), payload.export_format || 'pdf', JSON.stringify(payload.filters || {}), payload.next_run_at || null],
        insert: 'INSERT INTO report_schedules (user_id, report_id, name, frequency, recipients, export_format, filters, next_run_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT schedule_id AS id, user_id AS userId, report_id AS reportId, name, frequency, recipients, export_format AS exportFormat, filters, is_active AS isActive, next_run_at AS nextRunAt, created_at AS createdAt, updated_at AS updatedAt FROM report_schedules WHERE user_id = ? ORDER BY updated_at DESC',
        create: `CREATE TABLE IF NOT EXISTS report_schedules (
            schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            report_id VARCHAR(80) NOT NULL,
            name VARCHAR(120) NOT NULL,
            frequency ENUM('daily', 'weekly', 'monthly', 'quarterly') NOT NULL,
            recipients LONGTEXT NOT NULL,
            export_format ENUM('pdf', 'excel', 'csv') DEFAULT 'pdf',
            filters LONGTEXT,
            is_active TINYINT(1) DEFAULT 1,
            next_run_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_report_schedules_user (user_id)
        )`
    },
    alerts: {
        table: 'report_threshold_alerts',
        idColumn: 'alert_id',
        toRow: (userId, payload) => [userId, payload.reportId, payload.name, payload.metric, payload.operator, payload.threshold_value, payload.severity || 'medium', JSON.stringify(payload.recipients || [])],
        insert: 'INSERT INTO report_threshold_alerts (user_id, report_id, name, metric, operator, threshold_value, severity, recipients) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        select: 'SELECT alert_id AS id, user_id AS userId, report_id AS reportId, name, metric, operator, threshold_value AS thresholdValue, severity, recipients, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt FROM report_threshold_alerts WHERE user_id = ? ORDER BY updated_at DESC',
        create: `CREATE TABLE IF NOT EXISTS report_threshold_alerts (
            alert_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            report_id VARCHAR(80) NOT NULL,
            name VARCHAR(120) NOT NULL,
            metric VARCHAR(80) NOT NULL,
            operator ENUM('>', '>=', '<', '<=', '=') NOT NULL,
            threshold_value DECIMAL(18,2) NOT NULL,
            severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
            recipients LONGTEXT,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_report_alerts_user (user_id)
        )`
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

const ensureTable = async (collection) => {
    const config = tableConfig[collection];
    if (!config?.create) return;
    await db.query(config.create);
};

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
        await ensureTable(collection);
        const [rows] = await db.query(config.select, [userId]);
        return normalizeRows(collection, rows);
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        return fallbackList(collection, userId);
    }
};

const save = async (collection, userId, payload) => {
    const config = tableConfig[collection];
    if (!config) return fallbackSave(collection, userId, payload);
    try {
        await ensureTable(collection);
        const [result] = await db.query(config.insert, config.toRow(userId, payload));
        return { id: result.insertId, userId, createdAt: stamp(), updatedAt: stamp(), ...payload };
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        return fallbackSave(collection, userId, payload);
    }
};

const remove = async (collection, userId, id) => {
    const config = tableConfig[collection];
    if (!config) return false;
    try {
        await ensureTable(collection);
        const [result] = await db.query(`DELETE FROM ${config.table} WHERE ${config.idColumn} = ? AND user_id = ?`, [id, userId]);
        return result.affectedRows > 0;
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        const before = fallbackStore[collection].length;
        fallbackStore[collection] = fallbackStore[collection].filter((item) => !(item.id === id && item.userId === userId));
        return before !== fallbackStore[collection].length;
    }
};

const getFavorites = async (userId) => {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS report_favorites (
            favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            report_id VARCHAR(80) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_report_favorite_user_report (user_id, report_id)
        )`);
        const [rows] = await db.query('SELECT report_id AS reportId FROM report_favorites WHERE user_id = ?', [userId]);
        return rows.map((row) => row.reportId);
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        return [...fallbackStore.favorites].filter((key) => key.startsWith(`${userId}:`)).map((key) => key.split(':')[1]);
    }
};

const toggleFavorite = async (userId, reportId) => {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS report_favorites (
            favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            report_id VARCHAR(80) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_report_favorite_user_report (user_id, report_id)
        )`);
        const [existing] = await db.query('SELECT favorite_id FROM report_favorites WHERE user_id = ? AND report_id = ?', [userId, reportId]);
        if (existing.length) {
            await db.query('DELETE FROM report_favorites WHERE user_id = ? AND report_id = ?', [userId, reportId]);
            return { reportId, favorite: false };
        }
        await db.query('INSERT INTO report_favorites (user_id, report_id) VALUES (?, ?)', [userId, reportId]);
        return { reportId, favorite: true };
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
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
        await db.query(`CREATE TABLE IF NOT EXISTS report_audit_logs (
            audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            action VARCHAR(80) NOT NULL,
            report_id VARCHAR(80),
            metadata LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_report_audit_user_created (user_id, created_at)
        )`);
        const [result] = await db.query(
            'INSERT INTO report_audit_logs (user_id, action, report_id, metadata) VALUES (?, ?, ?, ?)',
            [userId, action, metadata.reportId || null, JSON.stringify(metadata)]
        );
        return { id: result.insertId, userId, action, metadata, createdAt: stamp() };
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        const record = { id: createId('audit'), userId, action, metadata, createdAt: stamp() };
        fallbackStore.auditLogs.unshift(record);
        fallbackStore.auditLogs = fallbackStore.auditLogs.slice(0, 500);
        return record;
    }
};

const getAuditLogs = async (userId, limit = 25) => {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS report_audit_logs (
            audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            action VARCHAR(80) NOT NULL,
            report_id VARCHAR(80),
            metadata LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_report_audit_user_created (user_id, created_at)
        )`);
        const [rows] = await db.query(
            'SELECT audit_id AS id, user_id AS userId, action, report_id AS reportId, metadata, created_at AS createdAt FROM report_audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [userId, Number(limit)]
        );
        return rows.map((row) => ({ ...row, metadata: parseJson(row.metadata, {}) }));
    } catch (error) {
        if (!['ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR'].includes(error.code)) throw error;
        return fallbackStore.auditLogs.filter((item) => item.userId === userId).slice(0, limit);
    }
};

module.exports = { list, save, remove, toggleFavorite, getFavorites, addAuditLog, getAuditLogs };
