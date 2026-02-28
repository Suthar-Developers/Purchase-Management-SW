const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const siteRoutes = require('./routes/siteRoute')

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
    req.send("Hello World")
})

app.use('/', siteRoutes)

app.listen(port, () => {
    console.log(`Your server is running on ${port}`)
})