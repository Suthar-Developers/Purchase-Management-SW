const express = require('express')
const router = express.Router()
const { createPurchaseRequest, fetchPurchaseRequests, updateMaterialStatus } = require('../controller/purchaseRequestController')

router.post('/createPurchaseRequest', createPurchaseRequest);
router.get('/purchase-requests', fetchPurchaseRequests);
router.put('/update-material-status', updateMaterialStatus);

module.exports = router;