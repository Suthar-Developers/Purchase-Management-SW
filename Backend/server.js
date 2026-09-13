const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const db = require('./config/db')
const projectRoute = require('./routes/projectRoute')
const vendorRoute = require('./routes/vendorRoute')
const purchaseRequestRoute = require('./routes/purchaseRequestRoute')
const purchaseOrderRoute = require('./routes/purchaseOrderRoute')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const materialsRoute = require('./routes/materialsRoute')

const app = express()
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.getConnection()
    .then((connection) => {
        connection.release();
    })
    .catch((error) => {
        console.error("Database connection error:", error.message);
    });

db.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
        permission_id INT AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(100) NOT NULL,
        module_key VARCHAR(100) NOT NULL,
        action_key VARCHAR(50) NOT NULL,
        can_access TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_role_permission (role_name, module_key, action_key)
    )
`).catch((error) => {
    console.error("Unable to initialize role permissions table:", error);
});

db.query(`
    CREATE TABLE IF NOT EXISTS user_permissions (
        permission_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        module_key VARCHAR(100) NOT NULL,
        action_key VARCHAR(50) NOT NULL,
        can_access TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_permission (user_id, module_key, action_key),
        CONSTRAINT fk_user_permissions_user
            FOREIGN KEY (user_id)
            REFERENCES users(user_id)
            ON DELETE CASCADE
    )
`).catch((error) => {
    console.error("Unable to initialize user permissions table:", error);
});

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/api', projectRoute)
app.use('/api', vendorRoute)
app.use('/api', purchaseRequestRoute)
app.use('/api', purchaseOrderRoute)
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', materialsRoute)

app.listen(port, () => {
    console.log(`Your server is running on ${port}`)
})
