const express = require('express')
const router = express.Router()
const { createPurchaseRequest, fetchPurchaseRequests, updateMaterialStatus, updatePRStatus } = require('../controller/purchaseRequestController')
const authenticate=require('../middleware/authenticate'); const {requirePermission}=require('../middleware/requirePermission'); const {csrfProtection}=require('../middleware/csrf');

router.post('/createPurchaseRequest',authenticate,csrfProtection,requirePermission('purchase_request.create'), createPurchaseRequest);
router.get('/purchase-requests',authenticate,requirePermission('purchase_request.view'), fetchPurchaseRequests);
router.put('/update-material-status',authenticate,csrfProtection,requirePermission('purchase_request.approve'), updateMaterialStatus);
router.put('/purchase-requests/:id/updatePRStatus',authenticate,csrfProtection,requirePermission('purchase_request.approve'), updatePRStatus);

module.exports = router;
