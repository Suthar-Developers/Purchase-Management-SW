const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const projectRoute = require('./routes/projectRoute')
const vendorRoute = require('./routes/vendorRoute')
const purchaseRequestRoute = require('./routes/purchaseRequestRoute')
const purchaseOrderRoute = require('./routes/purchaseOrderRoute')
const reportRoute = require('./routes/reportRoute')
const userRoute = require('./routes/userRoute')

const app = express()
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
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
app.use('/api', purchaseRequestRoute)
app.use('/api', purchaseOrderRoute)
app.use('/api', reportRoute)
app.use('/api', userRoute)

app.listen(port, () => {
    console.log(`Your server is running on ${port}`)
})
