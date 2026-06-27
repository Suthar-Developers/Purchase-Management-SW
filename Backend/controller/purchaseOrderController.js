const db = require('../config/db')

const evaluateThresholdAlerts = async ({ grandTotal, quantity, totalGst, totalDiscount }) => {
    try {
        const [alerts] = await db.query(`
            SELECT alert_id id, name, metric, operator, threshold_value thresholdValue, severity
            FROM report_threshold_alerts
            WHERE is_active = 1
        `);

        const values = {
            grand_total: Number(grandTotal || 0),
            quantity: Number(quantity || 0),
            total_gst: Number(totalGst || 0),
            total_discount: Number(totalDiscount || 0),
            averageRate: grandTotal && quantity ? Number(grandTotal) / Math.max(Number(quantity), 1) : 0
        };

        const compare = (left, operator, right) => {
            if (operator === '>') return left > right;
            if (operator === '>=') return left >= right;
            if (operator === '<') return left < right;
            if (operator === '<=') return left <= right;
            return left === right;
        };

        return alerts.filter((alert) => compare(values[alert.metric] || 0, alert.operator, Number(alert.thresholdValue || 0)));
    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') return [];
        throw error;
    }
};

const fetchApprovedPR = async (req, res) => {
    try {
        const sql = `
        SELECT pr.*, p.projectName, m.* 
        FROM purchase_request pr
        INNER JOIN materials m ON pr.request_id = m.request_id
        INNER JOIN projects p ON pr.project_id = p.project_id
        WHERE pr.requestStatus IN ('Approved', 'Partially Approved')
        `;

        const [rows] = await db.query(sql);

        const grouped = {}

        rows.forEach(row => {
            if (!grouped[row.request_id]) {
                grouped[row.request_id] = {
                    request_id: row.request_id,
                    projectName: row.projectName,
                    requestStatus: row.requestStatus,
                    contactPerson: row.contactPerson,
                    contactInfo: row.contactInfo,
                    deliverBefore: row.deliverBefore,
                    created_pr_at: row.created_pr_at,
                    materials: []
                }
            }

            grouped[row.request_id].materials.push({
                material_id: row.material_id,
                material: row.material,
                make: row.make,
                size: row.size,
                thickness: row.thickness,
                unit: row.unit,
                qty: row.qty,
                specification: row.specification,
                boqRef: row.boqRef,
                scope: row.scope,
                category: row.category,
                materialStatus: row.materialStatus
            })
        })

        return res.json(Object.values(grouped))

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

// Helper to get FY and Next Serial Number
const getNextSequence = async () => {
    const now = new Date();
    const month = now.getMonth() + 1; // Jan is 1
    const year = now.getFullYear();

    let fy;
    if (month >= 4) {
        // From April to Dec: FY 2026-27
        fy = `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
        // From Jan to March: FY 2025-26
        fy = `${(year - 1).toString().slice(-2)}-${year.toString().slice(-2)}`;
    }

    const prefix = `JRC/${fy}/`;

    // Look for the highest number in the CURRENT Financial Year only
    const [rows] = await db.query(
        "SELECT po_number FROM purchase_orders WHERE po_number LIKE ? ORDER BY po_id DESC LIMIT 1",
        [`${prefix}%`]
    );

    let nextSerial = 1;
    if (rows.length > 0) {
        const lastNumber = rows[0].po_number.split('/').pop();
        nextSerial = parseInt(lastNumber) + 1;
    }

    return `${prefix}${nextSerial.toString().padStart(4, '0')}`;
};

// 1. New endpoint to just FETCH the number for display
const fetchNextPONumber = async (req, res) => {
    try {
        const nextPO = await getNextSequence();
        res.json({ po_number: nextPO });
    } catch (err) {
        res.status(500).json({ message: "Error generating sequence" });
    }
};

const newPurchaseOrder = async (req, res) => {
    try {
        // Re-generate the number at the moment of saving to ensure no duplicates
        const finalPONumber = await getNextSequence();

        const { vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number, billing_contact_email, initiator, initiator_number, total_amount, total_discount, subtotal, taxable_amount, total_gst, grand_total, amount_in_words, po_status, materials, extraCharges } = req.body

        if (!finalPONumber || !project_id) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        // 1. INSERT PO
        const [poResult] = await db.query(`
        INSERT INTO purchase_orders(po_number, vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number, billing_contact_email, initiator, initiator_number, total_amount, total_discount, subtotal, taxable_amount, total_gst, grand_total, amount_in_words, po_status)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [finalPONumber, vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number || null, billing_contact_email || null, initiator, initiator_number, total_amount, total_discount || null, subtotal, taxable_amount, total_gst, grand_total, amount_in_words || null, po_status || "Draft"]
        );

        const po_id = poResult.insertId;

        // 2. INSERT MATERIALS
        for (const m of materials) {

            const rowQty = Number(m.qty || 0);
            const rowRate = Number(m.rate || 0);
            const rowDiscPercent = Number(m.discount || 0);
            const rowGstPercent = Number(m.gst || 0);

            const rowAmount = rowQty * rowRate;
            const rowDiscAmount = (rowAmount * rowDiscPercent) / 100;
            const rowTaxable = rowAmount - rowDiscAmount;
            const rowGstAmount = (rowTaxable * rowGstPercent) / 100;
            const rowTotal = rowTaxable + rowGstAmount;

            await db.query(
                `INSERT INTO purchase_order_items
        (po_id, item_description, unit, qty, rate, discount_percent, gst_percent,
         amount, discount_amount, taxable_amount, gst_amount, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    po_id,
                    m.material,
                    m.unit,
                    rowQty,
                    rowRate,
                    rowDiscPercent,
                    rowGstPercent,
                    rowAmount,
                    rowDiscAmount,
                    rowTaxable,
                    rowGstAmount,
                    rowTotal
                ]
            );
        }

        // 3. EXTRA CHARGES (now supports multiple charges per PO)
        if (Array.isArray(extraCharges)) {
            for (const charge of extraCharges) {
                const eAmount = Number(charge.amount || 0);
                if (eAmount <= 0) continue;

                const eGstPercent = Number(charge.gst || 0);
                const eGstAmount = (eAmount * eGstPercent) / 100;
                const eTotalAmount = (eAmount + eGstAmount);

                await db.query(
                    `INSERT INTO purchase_order_extra_charges
            (po_id, category, amount, gst_percent, gst_amount, total_amount)
            VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        po_id,
                        charge.category,
                        eAmount,
                        eGstPercent,
                        eGstAmount,
                        eTotalAmount
                    ]
                );
            }
        }

        const totalQuantity = Array.isArray(materials)
            ? materials.reduce((sum, item) => sum + Number(item.qty || 0), 0)
            : 0;
        const thresholdAlerts = await evaluateThresholdAlerts({
            grandTotal: grand_total,
            quantity: totalQuantity,
            totalGst: total_gst,
            totalDiscount: total_discount
        });

        return res.status(201).json({
            message: thresholdAlerts.length
                ? "New purchase order placed successfully. Threshold alert matched."
                : "New purchase order placed successfully..",
            po_id,
            thresholdAlerts
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

const draftedPurchaseOrders = async (req, res) => {
    try {
        const sql = `
            SELECT po.*, 
                   p.projectName, 
                   v.vendorName 
            FROM purchase_orders po
            LEFT JOIN projects p ON po.project_id = p.project_id
            LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
            WHERE po.po_status = 'Draft'
            ORDER BY po.po_id ASC
        `
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

// Fetch approved & revised POs
const approvedPurchaseOrders = async (req, res) => {
    try {
        const sql = `
            SELECT po.*, 
                   p.projectName, 
                   v.vendorName 
            FROM purchase_orders po
            LEFT JOIN projects p ON po.project_id = p.project_id
            LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
            WHERE po.po_status IN ('Approved', 'Revised')
            ORDER BY po.po_id ASC
        `
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const fetchPurchaseOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetching main PO details
        const [poRows] = await db.query(
            `SELECT * FROM purchase_orders WHERE po_id = ?`,
            [id]
        );
        if (poRows.length === 0) {
            return res.status(404).json({ message: "PO not found" });
        }
        const po = poRows[0];

        // 2. Fetching materials (items)
        const [items] = await db.query(
            `SELECT 
                item_description AS material,
                unit, qty, rate, discount_percent AS discount,
                gst_percent AS gst, total_amount AS total
             FROM purchase_order_items
             WHERE po_id = ?`,
            [id]
        );

        // 3. Fetching extra charges (if any) - a PO can have multiple
        const [extraRows] = await db.query(
            `SELECT category, amount, gst_percent AS gst
             FROM purchase_order_extra_charges
             WHERE po_id = ?`,
            [id]
        );

        // 4. Return complete PO object
        const fullPO = {
            ...po,
            materials: items,
            extraCharges: extraRows
        };

        return res.status(200).json(fullPO);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }

}

const updatePOStatus = async (req, res) => {
    const { id } = req.params
    const { po_status } = req.body

    try {
        const sql = `UPDATE purchase_orders 
        SET po_status=?
        WHERE po_id=?`

        const [result] = await db.query(sql, [po_status, id]);

        return res.status(200).json({ message: "Status updated", result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { fetchApprovedPR, fetchNextPONumber, newPurchaseOrder, draftedPurchaseOrders, approvedPurchaseOrders, fetchPurchaseOrderById, updatePOStatus }