const db = require("../config/db")

const newVendor = async (req, res) => {
    try {
        const { vendorName, vendorEmail, vendorContactNumber, vendorPortal, vendorType, vendorTag, pan, gst, msme, status, accountHolderName, accountNumber, ifsc, bankName, location } = req.body

        if (!vendorName || !vendorType) {
            return res.status(400).json({ message: "Required field is missing.." })
        }

        const sql = `
        INSERT INTO vendors(vendorName, vendorEmail, vendorContactNumber, vendorPortal, vendorType, vendorTag, pan, gst, msme, status, accountHolderName, accountNumber, ifsc, bankName, location)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [vendorName, vendorEmail || null, vendorContactNumber || null, vendorPortal || null, vendorType, vendorTag, pan || null, gst || null, msme || null, status, accountHolderName || null, accountNumber || null, ifsc || null, bankName || null, location || null]

        const [result] = await db.query(sql, values);

        return res.status(201).json({ message: "New vendor created successfully.." })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const getAllVendors = async (req, res) => {
    try {
        const sql = "SELECT * FROM vendors ORDER BY LOWER(TRIM(vendorName)) ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const updateVendor = async (req, res) => {
    const id = req.params.id
    const data = req.body

    try {
        const sql = `UPDATE vendors 
        SET vendorName=?, vendorEmail=?, vendorContactNumber=?, vendorPortal=?, vendorType=?, vendorTag=?, pan=?, gst=?, msme=?, status=?, accountHolderName=?, accountNumber=?, ifsc=?, bankName=?, location=?
        WHERE vendor_id=?`

        const [rows] = await db.query(sql,
            [data.vendorName, data.vendorEmail || null, data.vendorContactNumber || null, data.vendorPortal || null, data.vendorType, data.vendorTag, data.pan || null, data.gst || null, data.msme || null, data.status, data.accountHolderName || null, data.accountNumber || null, data.ifsc || null, data.bankName || null, data.location || null, id])

            return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { newVendor, getAllVendors, updateVendor };