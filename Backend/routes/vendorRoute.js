const express = require('express');
const router = express.Router();
const {newVendor, getAllVendors, updateVendor} = require("../controller/vendorController");
const authenticate = require('../middleware/authenticate'); const { requirePermission } = require('../middleware/requirePermission'); const { csrfProtection } = require('../middleware/csrf');

router.post('/createVendor', authenticate, csrfProtection, requirePermission('vendor.create'), newVendor)
router.get('/vendors', authenticate, requirePermission('vendor.view'), getAllVendors)
router.put('/vendors/:id', authenticate, csrfProtection, requirePermission('vendor.edit'), updateVendor)

module.exports = router;
