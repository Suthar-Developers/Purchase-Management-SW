const express = require('express')
const router = express.Router()
const { fetchApprovedPR, newPurchaseOrder, draftedPurchaseOrders, fetchPurchaseOrderById, updatePOStatus } = require('../controller/purchaseOrderController')

router.get('/approvedPurchaseRequests', fetchApprovedPR);
router.get('/purchase-orders/drafted-purchase-orders', draftedPurchaseOrders);
router.get('/purchase-orders/:id', fetchPurchaseOrderById);
router.post('/new-purchase-order', newPurchaseOrder);
router.put('/purchase-orders/:id/status', updatePOStatus);

module.exports = router;