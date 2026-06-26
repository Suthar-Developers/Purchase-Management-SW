const VALID_SORT_FIELDS = new Set([
    'po_number',
    'order_date',
    'created_at',
    'projectName',
    'vendorName',
    'po_status',
    'grand_total',
    'total_amount',
    'qty',
    'rate',
    'total_amount'
]);

const FIELD_MAP = {
    projectId: 'po.project_id',
    vendorId: 'po.vendor_id',
    poNumber: 'po.po_number',
    status: 'po.po_status',
    project: 'p.projectName',
    vendor: 'v.vendorName',
    city: 'p.city',
    state: 'p.state',
    createdBy: 'po.prepared_by',
    approvedBy: 'po.approved_by',
    category: 'poi.item_description',
    item: 'poi.item_description',
    gstPercent: 'poi.gst_percent',
    minAmount: 'po.grand_total',
    maxAmount: 'po.grand_total',
    minQuantity: 'poi.qty',
    maxQuantity: 'poi.qty'
};

const toArray = (value) => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

const addInFilter = (where, params, column, values) => {
    if (!values.length) return;
    where.push(`${column} IN (${values.map(() => '?').join(', ')})`);
    params.push(...values);
};

const buildReportFilters = (query = {}) => {
    const where = [];
    const params = [];

    if (query.startDate) {
        where.push('COALESCE(po.order_date, DATE(po.created_at)) >= ?');
        params.push(query.startDate);
    }

    if (query.endDate) {
        where.push('COALESCE(po.order_date, DATE(po.created_at)) <= ?');
        params.push(query.endDate);
    }

    addInFilter(where, params, FIELD_MAP.projectId, toArray(query.projectId));
    addInFilter(where, params, FIELD_MAP.vendorId, toArray(query.vendorId));
    addInFilter(where, params, FIELD_MAP.status, toArray(query.status));
    addInFilter(where, params, FIELD_MAP.city, toArray(query.city));
    addInFilter(where, params, FIELD_MAP.state, toArray(query.state));
    addInFilter(where, params, FIELD_MAP.createdBy, toArray(query.createdBy));
    addInFilter(where, params, FIELD_MAP.approvedBy, toArray(query.approvedBy));
    addInFilter(where, params, FIELD_MAP.gstPercent, toArray(query.gstPercent));

    const textFilters = ['poNumber', 'vendor', 'project', 'category', 'item'];
    textFilters.forEach((key) => {
        if (query[key]) {
            where.push(`${FIELD_MAP[key]} LIKE ?`);
            params.push(`%${query[key]}%`);
        }
    });

    if (query.requester) {
        where.push(`EXISTS (
            SELECT 1 FROM purchase_request prx
            WHERE prx.project_id = po.project_id AND prx.contactPerson LIKE ?
        )`);
        params.push(`%${query.requester}%`);
    }

    if (query.minAmount) {
        where.push(`${FIELD_MAP.minAmount} >= ?`);
        params.push(Number(query.minAmount));
    }

    if (query.maxAmount) {
        where.push(`${FIELD_MAP.maxAmount} <= ?`);
        params.push(Number(query.maxAmount));
    }

    if (query.minQuantity) {
        where.push(`${FIELD_MAP.minQuantity} >= ?`);
        params.push(Number(query.minQuantity));
    }

    if (query.maxQuantity) {
        where.push(`${FIELD_MAP.maxQuantity} <= ?`);
        params.push(Number(query.maxQuantity));
    }

    if (query.search) {
        where.push(`(
            po.po_number LIKE ? OR
            p.projectName LIKE ? OR
            v.vendorName LIKE ? OR
            poi.item_description LIKE ? OR
            po.po_status LIKE ?
        )`);
        params.push(...Array(5).fill(`%${query.search}%`));
    }

    return {
        whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
        params
    };
};

const getPagination = (query = {}) => {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 25), 1), 250);
    return { page, limit, offset: (page - 1) * limit };
};

const getSort = (query = {}, fallback = 'created_at') => {
    const rawField = String(query.sortBy || fallback);
    const field = VALID_SORT_FIELDS.has(rawField) ? rawField : fallback;
    const order = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    return { field, order };
};

module.exports = { buildReportFilters, getPagination, getSort, toArray };
