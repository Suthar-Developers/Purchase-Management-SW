const express = require('express')
const router = express.Router()
const { fetchApprovedPR, newPurchaseOrder } = require('../controller/purchaseOrderController')

router.get('/approvedPurchaseRequests', fetchApprovedPR);
router.post('/new-purchase-order', newPurchaseOrder);

module.exports = router;