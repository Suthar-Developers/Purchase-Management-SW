const db = require('../config/db');
const { buildReportFilters, getPagination, getSort } = require('../utils/reportQueryBuilder');

const BASE_FROM = `
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.po_id = poi.po_id
    LEFT JOIN projects p ON po.project_id = p.project_id
    LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
`;

const withCache = (() => {
    const cache = new Map();
    return async (key, ttlMs, resolver) => {
        const cached = cache.get(key);
        if (cached && cached.expiresAt > Date.now()) return cached.value;
        const value = await resolver();
        cache.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
    };
})();

const query = async (sql, params = []) => {
    const [rows] = await db.query(sql, params);
    return rows;
};

const queryOne = async (sql, params = []) => {
    const rows = await query(sql, params);
    return rows[0] || {};
};

const getOverview = async (filters) => {
    const { whereSql, params } = buildReportFilters(filters);

    return withCache(`overview:${JSON.stringify(filters)}`, 30000, async () => {
        const summary = await queryOne(`
            SELECT
                (SELECT COUNT(*) FROM purchase_request) totalPurchaseRequests,
                COUNT(DISTINCT po.po_id) totalPurchaseOrders,
                COUNT(DISTINCT CASE WHEN po.po_status = 'Approved' THEN po.po_id END) approvedPO,
                COUNT(DISTINCT CASE WHEN po.po_status IN ('Draft', 'Pending') THEN po.po_id END) pendingPO,
                COUNT(DISTINCT CASE WHEN po.po_status = 'Rejected' THEN po.po_id END) rejectedPO,
                COUNT(DISTINCT CASE WHEN po.po_status = 'Hold' THEN po.po_id END) holdPO,
                COUNT(DISTINCT CASE WHEN poi.total_amount IS NOT NULL AND po.po_status = 'Hold' THEN poi.item_id END) itemHoldPO,
                COUNT(DISTINCT v.vendor_id) totalVendors,
                COUNT(DISTINCT CASE WHEN v.status = 'Active' THEN v.vendor_id END) activeVendors,
                COUNT(DISTINCT p.project_id) totalProjects,
                COUNT(DISTINCT p.city) totalCities,
                COALESCE(SUM(DISTINCT po.grand_total), 0) totalPurchaseValue,
                COALESCE(AVG(DISTINCT po.grand_total), 0) averagePOValue,
                COALESCE(AVG(TIMESTAMPDIFF(HOUR, po.created_at, po.order_approved_date)), 0) averageApprovalTime,
                COALESCE(SUM(DISTINCT po.total_discount), 0) totalDiscount,
                COALESCE(SUM(DISTINCT po.total_gst), 0) totalTax,
                COALESCE(SUM(DISTINCT po.total_discount), 0) totalSavings,
                COALESCE(SUM(DISTINCT po.total_amount), 0) totalCost,
                COALESCE(SUM(poi.qty), 0) totalQuantityPurchased
            ${BASE_FROM}
            ${whereSql}
        `, params);

        const trend = await query(`
            SELECT DATE_FORMAT(COALESCE(po.order_date, DATE(po.created_at)), '%Y-%m') label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY label
            LIMIT 24
        `, params);

        const status = await query(`
            SELECT COALESCE(po.po_status, 'Unknown') label,
                   COUNT(DISTINCT po.po_id) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY value DESC
        `, params);

        const vendorShare = await query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') label,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 10
        `, params);

        return { summary, charts: { trend, status, vendorShare } };
    });
};

const getReportRows = async (reportId, filters) => {
    const { whereSql, params } = buildReportFilters(filters);
    const { page, limit, offset } = getPagination(filters);
    const { field, order } = getSort(filters, 'created_at');

    const selectByReport = {
        'purchase-requests': `
            SELECT pr.request_id id, p.projectName project, pr.contactPerson requester,
                   pr.requestStatus status, pr.deliverBefore, pr.created_pr_at created_at,
                   COUNT(m.material_id) item_count
            FROM purchase_request pr
            LEFT JOIN projects p ON pr.project_id = p.project_id
            LEFT JOIN materials m ON pr.request_id = m.request_id
            GROUP BY pr.request_id, p.projectName, pr.contactPerson, pr.requestStatus, pr.deliverBefore, pr.created_pr_at
            ORDER BY pr.created_pr_at DESC
            LIMIT ? OFFSET ?
        `,
        default: `
            SELECT po.po_id id, po.po_number, po.po_status, po.order_date, po.created_at,
                   p.projectName, p.city, p.state, v.vendorName,
                   po.total_amount, po.total_discount, po.total_gst, po.grand_total,
                   COUNT(poi.item_id) items, COALESCE(SUM(poi.qty), 0) quantity,
                   COALESCE(AVG(poi.rate), 0) average_rate
            ${BASE_FROM}
            ${whereSql}
            GROUP BY po.po_id, po.po_number, po.po_status, po.order_date, po.created_at,
                     p.projectName, p.city, p.state, v.vendorName, po.total_amount,
                     po.total_discount, po.total_gst, po.grand_total
            ORDER BY ${field} ${order}
            LIMIT ? OFFSET ?
        `
    };

    const rowsSql = selectByReport[reportId] || selectByReport.default;
    const rowsParams = reportId === 'purchase-requests' ? [limit, offset] : [...params, limit, offset];

    const countSql = reportId === 'purchase-requests'
        ? 'SELECT COUNT(*) total FROM purchase_request'
        : `SELECT COUNT(DISTINCT po.po_id) total ${BASE_FROM} ${whereSql}`;

    const [rows, count] = await Promise.all([
        query(rowsSql, rowsParams),
        queryOne(countSql, reportId === 'purchase-requests' ? [] : params)
    ]);

    return {
        rows,
        pagination: { page, limit, total: Number(count.total || 0), pages: Math.ceil(Number(count.total || 0) / limit) }
    };
};

const getReportAnalytics = async (reportId, filters) => {
    const { whereSql, params } = buildReportFilters(filters);
    const itemWhereSql = whereSql ? `${whereSql} AND poi.item_description IS NOT NULL` : 'WHERE poi.item_description IS NOT NULL';

    const [monthly, projectWise, cityWise, vendorWise, itemRates, quantity, costBreakdown] = await Promise.all([
        query(`
            SELECT DATE_FORMAT(COALESCE(po.order_date, DATE(po.created_at)), '%Y-%m') label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY label
            LIMIT 36
        `, params),
        query(`
            SELECT COALESCE(p.projectName, 'Unassigned') label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 15
        `, params),
        query(`
            SELECT COALESCE(p.city, 'Unknown') label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 15
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value,
                   COALESCE(AVG(poi.rate), 0) averageRate
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 15
        `, params),
        query(`
            SELECT poi.item_description label,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   AVG(poi.rate) averageRate,
                   COUNT(*) purchases,
                   COALESCE(SUM(poi.qty), 0) quantity
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY poi.item_description
            ORDER BY purchases DESC
            LIMIT 20
        `, params),
        query(`
            SELECT poi.item_description label,
                   COALESCE(SUM(poi.qty), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 15
        `, params),
        query(`
            SELECT 'Subtotal' label, COALESCE(SUM(DISTINCT po.subtotal), 0) value ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'Discount', COALESCE(SUM(DISTINCT po.total_discount), 0) ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'GST', COALESCE(SUM(DISTINCT po.total_gst), 0) ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'Grand Total', COALESCE(SUM(DISTINCT po.grand_total), 0) ${BASE_FROM} ${whereSql}
        `, [...params, ...params, ...params, ...params])
    ]);

    return {
        reportId,
        charts: { monthly, projectWise, cityWise, vendorWise, itemRates, quantity, costBreakdown }
    };
};

const getFilterOptions = async () => {
    const [projects, vendors, cities, states, statuses, gstRates, creators, approvers, items] = await Promise.all([
        query('SELECT project_id value, projectName label FROM projects ORDER BY projectName'),
        query('SELECT vendor_id value, vendorName label FROM vendors ORDER BY vendorName'),
        query('SELECT DISTINCT city value, city label FROM projects WHERE city IS NOT NULL AND city <> "" ORDER BY city'),
        query('SELECT DISTINCT state value, state label FROM projects WHERE state IS NOT NULL AND state <> "" ORDER BY state'),
        query('SELECT DISTINCT po_status value, po_status label FROM purchase_orders WHERE po_status IS NOT NULL ORDER BY po_status'),
        query('SELECT DISTINCT gst_percent value, CONCAT(gst_percent, "%") label FROM purchase_order_items WHERE gst_percent IS NOT NULL ORDER BY gst_percent'),
        query('SELECT DISTINCT prepared_by value, prepared_by label FROM purchase_orders WHERE prepared_by IS NOT NULL AND prepared_by <> "" ORDER BY prepared_by'),
        query('SELECT DISTINCT approved_by value, approved_by label FROM purchase_orders WHERE approved_by IS NOT NULL AND approved_by <> "" ORDER BY approved_by'),
        query('SELECT DISTINCT item_description value, item_description label FROM purchase_order_items WHERE item_description IS NOT NULL AND item_description <> "" ORDER BY item_description LIMIT 500')
    ]);

    return { projects, vendors, cities, states, statuses, gstRates, creators, approvers, items };
};

module.exports = { getOverview, getReportRows, getReportAnalytics, getFilterOptions };
