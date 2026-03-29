const express = require('express')
const router = express.Router()
const { fetchApprovedPR } = require('../controller/purchaseOrderController')

router.get('/approvedPurchaseRequests', fetchApprovedPR);

module.exports = router;