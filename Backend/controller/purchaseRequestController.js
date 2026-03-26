const db = require('../config/db')

const createPurchaseRequest = async (req, res) => {
    try {
        const { project_id, sendTo, contactPerson, contactInfo, materials } = req.body

        if (!project_id) {
            return res.status(400).json({ message: "Project is required" });
        }

        const [result] = await db.query(
            `INSERT INTO purchase_request (project_id, sendTo, contactPerson, contactInfo)
            VALUES(?, ?, ?, ?)`,
            [
                project_id,
                sendTo,
                contactPerson,
                contactInfo
            ]
        );

        const request_id = result.insertId;

        for (const m of materials) {
            await db.query(
                `INSERT INTO materials (request_id, material, specification, make, size, thickness, qty, unit, isNtItem, boqRef, scope, category, deliveryDate)
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
                    m.deliveryDate]
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
        const sql = `SELECT * FROM purchase_request pr INNER JOIN materials m ON pr.request_id = m.request_id`;
        const [rows] = await db.query(sql);

        return res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {createPurchaseRequest, fetchPurchaseRequests};