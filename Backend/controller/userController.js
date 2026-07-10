const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (req, res)=> {
    try {
        const {fullName, username, password, role} = req.body;

        if(!username || !password){
            return res.status(400).json({ message: "Username and password are required."})
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const sql = `INSERT INTO users(full_name, username, password_hash, role_id)
        VALUES(?, ?, ?, ?) `;

        const values = [fullName, username, hashedPassword, role];

        const result = await db.query(sql, values);

        return res.status(201).json({message: "New user created successfully..."})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server error"})        
    }
}

module.exports = createUser;