const express = require('express')
const router = express.Router()
const { fetchApprovedPR, fetchNextPONumber, newPurchaseOrder, draftedPurchaseOrders, approvedPurchaseOrders, fetchPurchaseOrderById, updatePOStatus } = require('../controller/purchaseOrderController')

router.get('/approvedPurchaseRequests', fetchApprovedPR);
router.get('/generate-po-number', fetchNextPONumber);
router.get('/purchase-orders/drafted-purchase-orders', draftedPurchaseOrders);
router.get('/purchase-orders/approved-purchase-orders', approvedPurchaseOrders);
router.get('/purchase-orders/:id', fetchPurchaseOrderById);
router.post('/new-purchase-order', newPurchaseOrder);
router.put('/purchase-orders/:id/updatePOStatus', updatePOStatus);

module.exports = router;