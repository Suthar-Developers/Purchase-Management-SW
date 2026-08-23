const express = require('express')
const router = express.Router()
const { createPurchaseRequest, fetchPurchaseRequests, updateMaterialStatus, updatePRStatus } = require('../controller/purchaseRequestController')
const authenticate = require('../middleware/authenticate')
const permissionAuthorize = require('../middleware/permissionAuthorize')

router.post('/createPurchaseRequest', authenticate, permissionAuthorize('purchase_requests', 'create'), createPurchaseRequest);
router.get('/purchase-requests', authenticate, permissionAuthorize('purchase_requests', 'view'), fetchPurchaseRequests);
router.put('/update-material-status', authenticate, permissionAuthorize('purchase_requests', 'approve'), updateMaterialStatus);
router.put('/purchase-requests/:id/updatePRStatus', authenticate, permissionAuthorize('purchase_requests', 'approve'), updatePRStatus);

module.exports = router;
