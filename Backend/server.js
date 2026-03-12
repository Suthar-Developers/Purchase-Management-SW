const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const projectRoute = require('./routes/projectRoute')
const vendorRoute = require('./routes/vendorRoute')

const app = express()
const port = 3000;

app.use(express.json())
app.use(cors())

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection error !")
        return res.status(500).send("Database connection failed...")
    }
})

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/api', projectRoute)
app.use('/api', vendorRoute)

app.listen(port, () => {
    console.log(`Your server is running on ${port}`)
})