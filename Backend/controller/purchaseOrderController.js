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

module.exports = { fetchApprovedPR }