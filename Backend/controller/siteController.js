const db = require("../config/db")

const newSite = async (req, res)=>{
    try{
        const {siteName, siteCode, address, startDate, endDate, projectManager, contactNumber, clientName, status, budget, description} = req.body

        if(!siteName || !address ){
            return res.status(400).json({message: "Required field is missing.."})
        }

        const sql = `
        INSERT INTO sites(siteName, siteCode, address, startDate, endDate, projectManager, contactNumber, clientName, status, budget, description)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [siteName, siteCode, address, startDate, endDate, projectManager, contactNumber, clientName, status, budget, description]

        const [result] = await db.query(sql, values);

        return res.status(201).json({message: "New site created successfully.."})

    } catch(error){
        console.error(error)
        res.status(500).json({message: "Server Error"})
    }
}

const getAllSites = async (req, res)=> {
    try {
        const sql = "SELECT * FROM sites ORDER BY id ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error){
        console.error(error);
        return res.status(500).json({message: "Server Error"})
    }
}

module.exports = {newSite, getAllSites};