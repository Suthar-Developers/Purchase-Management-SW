const db = require("../config/db")

const newProject = async (req, res)=>{
    try{
        const {projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description} = req.body

        if(!projectName || !projectCode ){
            return res.status(400).json({message: "Required field is missing.."})
        }

        const sql = `
        INSERT INTO projects(projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [projectName, projectCode, clientName || null, projectAreaSqft || null, scopeOfWork || null, address || null, startDate, endDate, contactPersonName || null, contactPersonNumber || null, contactPersonEmail || null, status, budget || null, description || null]

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

const updateProject = async (req, res) => {
    const id = req.params.id
    const data = req.body

    try {
        const sql = `UPDATE projects 
        SET projectName=?, projectCode=?, clientName=?, projectAreaSqft=?, scopeOfWork=?, address=?, startDate=?, endDate=?, contactPersonName=?, contactPersonEmail=?, status=?, budget=?, description=?
        WHERE project_id=?`

        const [rows] = await db.query(sql,
            [data.projectName, data.projectCode, data.clientName || null, data.projectAreaSqft || null, data.scopeOfWork || null, data.address || null, data.startDate, data.endDate, data.contactPersonName || null, data.contactPersonEmail || null, data.status, data.budget || null, data.description || null, id])

            return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {newProject, getAllProjects, updateProject};