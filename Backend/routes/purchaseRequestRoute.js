const express = require('express')
const router = express.Router()
const { createPurchaseRequest, fetchPurchaseRequests, updateMaterialStatus, updatePRStatus } = require('../controller/purchaseRequestController')

router.post('/createPurchaseRequest', createPurchaseRequest);
router.get('/purchase-requests', fetchPurchaseRequests);
router.put('/update-material-status', updateMaterialStatus);
router.put('/purchase-requests/:id/updatePRStatus', updatePRStatus);

module.exports = router;