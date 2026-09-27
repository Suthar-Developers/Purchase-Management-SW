const db = require("../config/db")

const newMaterial = async (req, res) => {
    try {
        const { material_name, material_category, material_status } = req.body

        if (!material_name) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        // Check duplicate material name
        const [existing] = await db.query(
            `
            SELECT
                material_id,
                material_name,
                material_category,
                material_status
            FROM materials_list
            WHERE LOWER(TRIM(material_name)) = LOWER(TRIM(?))
            LIMIT 1
            `,
            [material_name]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Material already exists.",
                material: existing[0]
            });
        }

        const sql = `
        INSERT INTO materials_list(material_name, material_category, material_status)
        VALUES(?, ?, ?)
        `;

        const values = [material_name, material_category || "null", material_status || "Active"];

        const [result] = await db.query(sql, values);

        // Return the newly created material
        const [rows] = await db.query(
            `
            SELECT
                material_id,
                material_name,
                material_category,
                material_status
            FROM materials_list
            WHERE material_id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            message: "New material created successfully.",
            material: rows[0]
        });

    } catch (error) {
        console.error("CREATE MATERIAL ERROR:", error)
        return res.status(500).json({
            message: "Failed to create material.",
            error: error.message
        });
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
        const unitName = String(req.body.material_unit || "").trim();

        if (!unitName) {
            return res.status(400).json({
                message: "Unit name is required."
            });
        }

        // Check duplicate unit
        const [existing] = await db.query(
            `
            SELECT
                material_unit_id,
                material_unit
            FROM unit_list
            WHERE LOWER(TRIM(material_unit)) = LOWER(TRIM(?))
            LIMIT 1
            `,
            [unitName]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Unit already exists.",
                unit: existing[0]
            });
        }

        // Create unit
        const [result] = await db.query(
            `
            INSERT INTO unit_list(material_unit)
            VALUES(?)
            `,
            [unitName]
        );

        // Return newly created unit
        const [rows] = await db.query(
            `
            SELECT
                material_unit_id,
                material_unit
            FROM unit_list
            WHERE material_unit_id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            message: "New unit created successfully.",
            unit: rows[0]
        });
    } catch (error) {
        console.error("CREATE UNIT ERROR:", error);

        return res.status(500).json({
            message: "Failed to create unit.",
            error: error.message
        });
    }
};

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