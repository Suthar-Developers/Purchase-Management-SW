const db = require('../config/db')

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
                    deliverBefore: row.deliverBefore,
                    created_pr_at: row.created_pr_at,
                    materials: []
                }
            }

            grouped[row.request_id].materials.push({
                material_id: row.material_id,
                material: row.material,
                unit: row.unit,
                qty: row.qty,
                specification: row.specification,
                materialStatus: row.materialStatus
            })
        })

        return res.json(Object.values(grouped))

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

const newPurchaseOrder = async (req, res) => {
    try {
        const { po_number, vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number, billing_contact_email, initiator, initiator_number, total_amount, total_discount, subtotal, taxable_amount, total_gst, grand_total, amount_in_words, po_status, materials, extraCharge } = req.body

        if (!po_number || !project_id) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        // 1. INSERT PO
        const [poResult] = await db.query(`
        INSERT INTO purchase_orders(po_number, vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number, billing_contact_email, initiator, initiator_number, total_amount, total_discount, subtotal, taxable_amount, total_gst, grand_total, amount_in_words, po_status)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [po_number, vendor_id, project_id, order_date, order_placed_by, billing_address, delivery_address, billing_gst, billing_contact_number || null, billing_contact_email || null, initiator, initiator_number, total_amount, total_discount || null, subtotal, taxable_amount, total_gst, grand_total, amount_in_words || null, po_status || "Draft"]
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

        // 3. EXTRA CHARGE
        if (extraCharge && extraCharge.amount > 0) {

            const eAmount = Number(extraCharge.amount || 0);
            const eGstPercent = Number(extraCharge.gst || 0);
            const eGstAmount = (eAmount * eGstPercent) / 100;
            const eTotalAmount = (eAmount + eGstAmount);

            await db.query(
                `INSERT INTO purchase_order_extra_charges
        (po_id, category, amount, gst_percent, gst_amount, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    po_id,
                    extraCharge.category,
                    eAmount,
                    eGstPercent,
                    eGstAmount,
                    eTotalAmount
                ]
            );
        }

        return res.status(201).json({ message: "New purchase order placed successfully..", po_id })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { fetchApprovedPR, newPurchaseOrder }