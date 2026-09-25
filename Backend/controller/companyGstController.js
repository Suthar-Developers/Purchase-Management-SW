const db = require("../config/db");

const getAllCompanyGST = async (req, res) => {
    try {
        const sql = `
            SELECT
                gst_id,
                state,
                gstin,
                legal_name,
                billing_address
            FROM company_gst_details
            WHERE is_active = TRUE
            ORDER BY state ASC
        `;

        const [rows] = await db.query(sql);

        return res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching company GST details:", error);

        return res.status(500).json({
            message: "Failed to fetch company GST details"
        });
    }
};

module.exports = {
    getAllCompanyGST
};