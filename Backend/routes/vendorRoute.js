const express = require('express');
const router = express.Router();
const {newVendor, getAllVendors} = require("../controller/vendorController");

router.post('/createVendor', newVendor)
router.get('/vendors', getAllVendors)

module.exports = router;