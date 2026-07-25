const express = require('express');
const router = express.Router();
const {newVendor, getAllVendors, updateVendor} = require("../controller/vendorController");

router.post('/createVendor', newVendor)
router.get('/vendors', getAllVendors)
router.put('/vendors/:id', updateVendor)

module.exports = router;