const express = require('express');
const router = express.Router();
const {newVendor, getAllVendors, updateVendor} = require("../controller/vendorController");
const authenticate = require('../middleware/authenticate');
const permissionAuthorize = require('../middleware/permissionAuthorize');

router.post('/createVendor', authenticate, permissionAuthorize('vendors', 'create'), newVendor)
router.get('/vendors', authenticate, permissionAuthorize('vendors', 'view'), getAllVendors)
router.put('/vendors/:id', authenticate, permissionAuthorize('vendors', 'edit'), updateVendor)

module.exports = router;
