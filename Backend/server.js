const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db')
const projectRoute = require('./routes/projectRoute')
const vendorRoute = require('./routes/vendorRoute')
const purchaseRequestRoute = require('./routes/purchaseRequestRoute')
const purchaseOrderRoute = require('./routes/purchaseOrderRoute')
const reportRoute = require('./routes/reportRoute')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const { requestId, notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()
const port = 3000;

app.set('trust proxy', process.env.TRUST_PROXY === 'true');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(requestId);
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((value) => value.trim());
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); return callback(new Error('CORS origin denied')); }, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api/v1', adminRoute)
app.use('/api', adminRoute)

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Your server is running on ${port}`)
})
