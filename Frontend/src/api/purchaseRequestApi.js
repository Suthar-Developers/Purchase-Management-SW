import axios from 'axios'

export const createPurchaseRequest = async (data) => {
    try {
        const res = await axios.post("http://localhost:3000/api/createPurchaseRequest", data)
        return res.data
    } catch (error) {
        console.error("Error creating new purchase request", error)
        throw error
    }
}

export const fetchPurchaseRequests = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/purchase-requests")
        return res.data
    } catch (error) {
        console.error("Error fetching purchase request", error)
        throw error
    }
}

export const updateMaterialStatus = async (material_id, materialStatus) => {
    try {
        const res = await axios.put("http://localhost:3000/api/update-material-status", {material_id, materialStatus})
        return res.data
    } catch (error) {
        console.error("Error updating material status", error)
        throw error
    }
}

export const fetchApprovedPR = async (req, res) => {
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