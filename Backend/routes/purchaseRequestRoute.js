const express = require('express')
const router = express.Router()
const { createPurchaseRequest, fetchPurchaseRequests } = require('../controller/purchaseRequestController')

router.post('/createPurchaseRequest', createPurchaseRequest);
router.get('/purchase-requests', fetchPurchaseRequests);

module.exports = router;