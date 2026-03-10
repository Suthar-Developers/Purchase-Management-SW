const db = require("../config/db")

const newProject = async (req, res)=>{
    try{
        const {projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description} = req.body

        if(!projectName || !address ){
            return res.status(400).json({message: "Required field is missing.."})
        }

        const sql = `
        INSERT INTO projects(projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description]

        const [result] = await db.query(sql, values);

        return res.status(201).json({message: "New project created successfully.."})

    } catch(error){
        console.error(error)
        res.status(500).json({message: "Server Error"})
    }
}

const getAllProjects = async (req, res)=> {
    try {
        const sql = "SELECT * FROM projects ORDER BY LOWER(TRIM(projectName)) ASC"
        const [rows] = await db.query(sql)

        return res.status(200).json(rows);
    } catch (error){
        console.error(error);
        return res.status(500).json({message: "Server Error"})
    }
}

module.exports = {newProject, getAllProjects};