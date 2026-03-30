const db = require('../config/db')

const createPurchaseRequest = async (req, res) => {
    try {
        const { project_id, contactPerson, contactInfo, deliverBefore, requestStatus, materials } = req.body

        if (!project_id) {
            return res.status(400).json({ message: "Project is required" });
        }

        const [result] = await db.query(
            `INSERT INTO purchase_request (project_id, contactPerson, contactInfo, deliverBefore, requestStatus)
            VALUES(?, ?, ?, ?, ?)`,
            [
                project_id,
                contactPerson,
                contactInfo,
                deliverBefore,
                requestStatus
            ]
        );

        const request_id = result.insertId;

        for (const m of materials) {
            await db.query(
                `INSERT INTO materials (request_id, material, specification, make, size, thickness, qty, unit, isNtItem, boqRef, scope, category, materialStatus)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    request_id,
                    m.material,
                    m.specification,
                    m.make || null,
                    m.size || null,
                    m.thickness || null,
                    m.qty,
                    m.unit,
                    m.isNtItem,
                    m.boqRef || null,
                    m.scope,
                    m.category,
                    m.materialStatus || 'Pending']
            );
        }

        return res.status(201).json({ message: "New purchase request created successfully.." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const fetchPurchaseRequests = async (req, res) => {
    try {
        const sql = `SELECT pr.*, p.projectName, m.* FROM purchase_request pr INNER JOIN materials m ON pr.request_id = m.request_id INNER JOIN projects p ON pr.project_id = p.project_id`;
        const [rows] = await db.query(sql);

        const grouped = {};

        rows.forEach(row => {
            if (!grouped[row.request_id]) {
                grouped[row.request_id] = {
                    request_id: row.request_id,
                    project_id: row.project_id,
                    projectName: row.projectName,
                    deliverBefore: row.deliverBefore,
                    contactPerson: row.contactPerson,
                    contactInfo: row.contactInfo,
                    requestStatus: row.requestStatus,
                    materials: []
                };
            }

            grouped[row.request_id].materials.push({
                material_id: row.material_id,
                material: row.material,
                specification: row.specification,
                make: row.make,
                size: row.size,
                thickness: row.thickness,
                qty: row.qty,
                unit: row.unit,
                isNtItem: row.isNtItem,
                boqRef: row.boqRef,
                scope: row.scope,
                category: row.category,
                materialStatus: row.materialStatus
            });
        });

        return res.status(200).json(Object.values(grouped));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const updateMaterialStatus = async (req, res) => {
    const { material_id, materialStatus } = req.body

    if (!material_id || !materialStatus) {
        return res.status(400).json({ message: "material_id or status missing" })
    }

    try {
        const sql = `UPDATE materials 
        SET materialStatus=?
        WHERE material_id=?`

        const [updateResult] = await db.query(sql,
            [materialStatus, material_id])

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Material not found" });
        }

        // Get the request_id of this material
        const [materialRows] = await db.query(`SELECT request_id FROM materials WHERE material_id=?`, [material_id]);
        const request_id = materialRows[0].request_id;

        // Get statuses of all materials for this request
        const [allMaterials] = await db.query(`SELECT materialStatus FROM materials WHERE request_id=?`, [request_id]);

        // Determine the overall request status
        let requestStatus = "Pending";

        const statuses = allMaterials.map(m => m.materialStatus);

        if (statuses.every(s => s === "Approved")) {
            requestStatus = "Approved";
        } else if (statuses.some(s => s === "Approved")) {
            requestStatus = "Partially Approved";
        } else if (statuses.every(s => s === "Rejected")) {
            requestStatus = "Rejected";
        } else {
            requestStatus = "Pending";
        }

        // Update the purchase_request status
        await db.query(`UPDATE purchase_request SET requestStatus=? WHERE request_id=?`, [requestStatus, request_id]);

        return res.status(200).json({ message: "Material status updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { createPurchaseRequest, fetchPurchaseRequests, updateMaterialStatus };