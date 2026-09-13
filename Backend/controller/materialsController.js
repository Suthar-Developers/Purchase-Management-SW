const db = require("../config/db")

const newMaterial = async (req, res) => {
    try {
        const { material_name, material_code, material_category, material_status } = req.body

        if (!material_name || !material_code) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        const sql = `
        INSERT INTO materials_list(material_name, material_code, material_category, material_status)
        VALUES(?, ?, ?, ?)
        `;

        const values = [material_name, material_code, material_category, material_status || "Active"];

        const [result] = await db.query(sql, values);

        return res.status(201).json({ message: "New material created successfully.." })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const getAllMaterials = async (req, res) => {
    try {
        const sql = "SELECT * FROM materials_list ORDER BY LOWER(TRIM(material_name)) ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

// Update material - Pending

// const updateMaterial = async (req, res) => {
//     const id = req.params.id
//     const data = req.body

//     try {
//         const sql = `UPDATE materials_list 
//         SET material_name=?, material_category=?, materialStatus=?
//         WHERE material_id=?`

//         const [rows] = await db.query(sql,
//             [data.material_name, data.material_category, data.materialStatus, id])

//             return res.status(200).json(rows);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Server Error" })
//     }
// }

const newCategory = async (req, res) => {
    try {
        const { material_category } = req.body

        if (!material_category) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        const sql = `
        INSERT INTO category_list(material_category)
        VALUES(?)
        `;

        const values = [material_category];

        const [result] = await db.query(sql, values);

        return res.status(201).json({ message: "New category created successfully.." })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const sql = "SELECT * FROM category_list ORDER BY LOWER(TRIM(material_category)) ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const newUnit = async (req, res) => {
    try {
        const { material_unit } = req.body

        if (!material_unit) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        const sql = `
        INSERT INTO unit_list(material_unit)
        VALUES(?)
        `;

        const values = [material_unit];

        const [result] = await db.query(sql, values);

        return res.status(201).json({ message: "New unit created successfully.." })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const getAllUnits = async (req, res) => {
    try {
        const sql = "SELECT * FROM unit_list ORDER BY LOWER(TRIM(material_unit)) ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { newMaterial, getAllMaterials, newCategory, getAllCategories, newUnit, getAllUnits };