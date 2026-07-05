const db = require('../config/db');
const { buildReportFilters, getPagination, getSort } = require('../utils/reportQueryBuilder');

// Shared reporting join. Most report queries start from purchase_orders and enrich
// with items, project, and vendor fields. Keep this join small because it is used a lot.
const BASE_FROM = `
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.po_id = poi.po_id
    LEFT JOIN projects p ON po.project_id = p.project_id
    LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
`;

// Small in-memory cache for dashboard overview calls.
// Reduce TTL if you need instant KPI updates after every PO creation.
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

// Returns the top KPI cards and small overview charts.
// Add new dashboard KPI SQL aliases in this SELECT and in frontend kpiDefinitions.
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
                COALESCE(SUM(DISTINCT po.total_discount), 0) totalDiscount,
                COALESCE(SUM(DISTINCT po.total_gst), 0) totalTax,
                COALESCE(SUM(DISTINCT po.total_discount), 0) totalSavings,
                COALESCE(SUM(DISTINCT po.total_amount), 0) totalCost
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

// Returns the paginated table rows. Report-specific table SQL can be added
// in selectByReport; everything else uses the PO summary default.
const getReportRows = async (reportId, filters) => {
    const { whereSql, params } = buildReportFilters(filters);
    const { page, limit, offset } = getPagination(filters);
    const { field, order } = getSort(filters, 'created_at');

    // Purchase request does not start from purchase_orders, so it has its own query.
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

// Returns all chart/table datasets used by the report workspace.
// Most frontend report buttons reuse this same payload but display different sections.
const getReportAnalytics = async (reportId, filters) => {
    const { whereSql, params } = buildReportFilters(filters);
    // Item comparison charts need item rows only; this prevents null item names in tables.
    const itemWhereSql = whereSql ? `${whereSql} AND poi.item_description IS NOT NULL` : 'WHERE poi.item_description IS NOT NULL';

    const [monthly, projectWise, cityWise, vendorWise, itemRates, quantity, costBreakdown, rateByVendor, rateByProject, quantityByProject, quantityByVendor, vendorProjectAssignments, cityDetails, calendarActivity, itemVendorRates, itemProjectRates, projectItemDetails, vendorItemDetails, vendorRecommendations, costByMonth, costByProject, costByVendor, vendorShareDetails] = await Promise.all([
        // Monthly trend used by overview, cost, and financial analysis.
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
        // Project spend comparison; used by Project Report.
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
        // Vendor share summary; used by Vendor Analytics and the general chart panel.
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
        // Item rate high/low/average across all vendors/projects.
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
        // Same item compared across vendors. This answers: "Who sells this item cheaper?"
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
        // Same item compared across projects. This answers: "Which project paid more?"
        query(`
            SELECT poi.item_description label,
                   COALESCE(SUM(poi.qty), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY value DESC
            LIMIT 15
        `, params),
        // Recommendation table: for each item, rank vendors by average rate and repeat usage.
        query(`
            SELECT 'Subtotal' label, COALESCE(SUM(DISTINCT po.subtotal), 0) value ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'Discount', COALESCE(SUM(DISTINCT po.total_discount), 0) ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'GST', COALESCE(SUM(DISTINCT po.total_gst), 0) ${BASE_FROM} ${whereSql}
            UNION ALL
            SELECT 'Grand Total', COALESCE(SUM(DISTINCT po.grand_total), 0) ${BASE_FROM} ${whereSql}
        `, [...params, ...params, ...params, ...params]),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') label,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   AVG(poi.rate) averageRate,
                   COUNT(DISTINCT po.po_id) orders,
                   COUNT(DISTINCT p.project_id) projects,
                   COALESCE(SUM(poi.qty), 0) quantity,
                   COALESCE(SUM(poi.total_amount), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY averageRate ASC
            LIMIT 20
        `, params),
        query(`
            SELECT COALESCE(p.projectName, 'Unassigned') label,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   AVG(poi.rate) averageRate,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(poi.qty), 0) quantity,
                   COALESCE(SUM(poi.total_amount), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY averageRate DESC
            LIMIT 20
        `, params),
        query(`
            SELECT COALESCE(p.projectName, 'Unassigned') label,
                   COALESCE(SUM(poi.qty), 0) quantity,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(poi.total_amount), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY quantity DESC
            LIMIT 20
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') label,
                   COALESCE(SUM(poi.qty), 0) quantity,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(poi.total_amount), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY label
            ORDER BY quantity DESC
            LIMIT 20
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') vendor,
                   COALESCE(p.projectName, 'Unassigned') project,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(AVG(poi.rate), 0) averageRate,
                   COALESCE(SUM(poi.qty), 0) quantity,
                   COALESCE(SUM(poi.total_amount), 0) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY vendor, project
            ORDER BY orders DESC, value DESC
            LIMIT 40
        `, params),
        query(`
            SELECT COALESCE(p.city, 'Unknown') label,
                   COUNT(DISTINCT p.project_id) projects,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) cost,
                   COALESCE(MIN(poi.rate), 0) lowestRate,
                   COALESCE(MAX(poi.rate), 0) highestRate,
                   COALESCE(AVG(poi.rate), 0) averageRate,
                   COALESCE(SUM(poi.qty), 0) quantity
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY cost DESC
            LIMIT 20
        `, params),
        query(`
            SELECT DATE(COALESCE(po.order_date, po.created_at)) label,
                   COUNT(DISTINCT po.po_id) orders,
                   COALESCE(SUM(DISTINCT po.grand_total), 0) value,
                   COALESCE(SUM(poi.qty), 0) quantity
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY label DESC
            LIMIT 90
        `, params),
        query(`
            SELECT poi.item_description item,
                   COALESCE(v.vendorName, 'Unassigned') vendor,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   AVG(poi.rate) averageRate,
                   SUM(poi.qty) quantity,
                   SUM(poi.total_amount) value,
                   COUNT(DISTINCT po.po_id) orders
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY item, vendor
            ORDER BY item, averageRate ASC
            LIMIT 300
        `, params),
        query(`
            SELECT poi.item_description item,
                   COALESCE(p.projectName, 'Unassigned') project,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   AVG(poi.rate) averageRate,
                   SUM(poi.qty) quantity,
                   SUM(poi.total_amount) value,
                   COUNT(DISTINCT po.po_id) orders
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY item, project
            ORDER BY item, averageRate DESC
            LIMIT 300
        `, params),
        query(`
            SELECT COALESCE(p.projectName, 'Unassigned') project,
                   poi.item_description item,
                   COUNT(DISTINCT po.po_id) orders,
                   SUM(poi.qty) quantity,
                   AVG(poi.rate) averageRate,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   SUM(poi.total_amount) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY project, item
            ORDER BY project, orders DESC, quantity DESC
            LIMIT 300
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') vendor,
                   poi.item_description item,
                   COUNT(DISTINCT po.po_id) orders,
                   COUNT(DISTINCT p.project_id) projects,
                   SUM(poi.qty) quantity,
                   AVG(poi.rate) averageRate,
                   MIN(poi.rate) lowestRate,
                   MAX(poi.rate) highestRate,
                   SUM(poi.total_amount) value
            ${BASE_FROM}
            ${itemWhereSql}
            GROUP BY vendor, item
            ORDER BY vendor, averageRate ASC
            LIMIT 300
        `, params),
        query(`
            SELECT ranked.item,
                   ranked.vendor,
                   ranked.averageRate,
                   ranked.lowestRate,
                   ranked.highestRate,
                   ranked.orders,
                   ranked.projects,
                   ranked.quantity,
                   ranked.value,
                   CASE
                       WHEN ranked.orders >= 3 AND ranked.averageRate = best.itemLowestRate THEN 'Best repeat vendor'
                       WHEN ranked.averageRate = best.itemLowestRate THEN 'Lowest rate vendor'
                       WHEN ranked.orders >= 3 THEN 'Reliable vendor'
                       ELSE 'Consider after negotiation'
                   END recommendation
            FROM (
                SELECT poi.item_description item,
                       COALESCE(v.vendorName, 'Unassigned') vendor,
                       AVG(poi.rate) averageRate,
                       MIN(poi.rate) lowestRate,
                       MAX(poi.rate) highestRate,
                       COUNT(DISTINCT po.po_id) orders,
                       COUNT(DISTINCT p.project_id) projects,
                       SUM(poi.qty) quantity,
                       SUM(poi.total_amount) value
                ${BASE_FROM}
                ${itemWhereSql}
                GROUP BY poi.item_description, vendor
            ) ranked
            INNER JOIN (
                SELECT item, MIN(averageRate) itemLowestRate
                FROM (
                    SELECT poi.item_description item,
                           COALESCE(v.vendorName, 'Unassigned') vendor,
                           AVG(poi.rate) averageRate
                    ${BASE_FROM}
                    ${itemWhereSql}
                    GROUP BY poi.item_description, vendor
                ) item_rates
                GROUP BY item
            ) best ON best.item = ranked.item
            ORDER BY ranked.item, ranked.averageRate ASC, ranked.orders DESC
            LIMIT 300
        `, [...params, ...params]),
        query(`
            SELECT DATE_FORMAT(COALESCE(po.order_date, DATE(po.created_at)), '%Y-%m') label,
                   SUM(DISTINCT po.subtotal) subtotal,
                   SUM(DISTINCT po.total_discount) discount,
                   SUM(DISTINCT po.total_gst) tax,
                   SUM(DISTINCT po.grand_total) grandTotal
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY label
            LIMIT 36
        `, params),
        query(`
            SELECT COALESCE(p.projectName, 'Unassigned') label,
                   SUM(DISTINCT po.grand_total) grandTotal,
                   SUM(DISTINCT po.total_discount) discount,
                   SUM(DISTINCT po.total_gst) tax,
                   COUNT(DISTINCT po.po_id) orders
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY grandTotal DESC
            LIMIT 25
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') label,
                   SUM(DISTINCT po.grand_total) grandTotal,
                   SUM(DISTINCT po.total_discount) discount,
                   SUM(DISTINCT po.total_gst) tax,
                   COUNT(DISTINCT po.po_id) orders
            ${BASE_FROM}
            ${whereSql}
            GROUP BY label
            ORDER BY grandTotal DESC
            LIMIT 25
        `, params),
        query(`
            SELECT COALESCE(v.vendorName, 'Unassigned') vendor,
                   COUNT(DISTINCT po.po_id) orders,
                   COUNT(DISTINCT p.project_id) projects,
                   COUNT(DISTINCT poi.item_description) items,
                   SUM(DISTINCT po.grand_total) grandTotal,
                   SUM(poi.qty) quantity,
                   AVG(poi.rate) averageRate
            ${BASE_FROM}
            ${whereSql}
            GROUP BY vendor
            ORDER BY grandTotal DESC
            LIMIT 50
        `, params)
    ]);

    return {
        reportId,
        charts: {
            monthly,
            projectWise,
            cityWise,
            vendorWise,
            itemRates,
            quantity,
            costBreakdown,
            rateByVendor,
            rateByProject,
            quantityByProject,
            quantityByVendor,
            vendorProjectAssignments,
            cityDetails,
            calendarActivity,
            itemVendorRates,
            itemProjectRates,
            projectItemDetails,
            vendorItemDetails,
            vendorRecommendations,
            costByMonth,
            costByProject,
            costByVendor,
            vendorShareDetails
        }
    };
};

// Populates dropdowns in GlobalFilters. If a dropdown is empty, check these queries first.
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