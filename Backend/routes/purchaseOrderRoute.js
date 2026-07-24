const express = require('express')
const router = express.Router()
const { fetchApprovedPR, fetchNextPONumber, newPurchaseOrder, draftedPurchaseOrders, approvedPurchaseOrders, fetchPurchaseOrderById, updatePOStatus } = require('../controller/purchaseOrderController')
const authenticate=require('../middleware/authenticate'); const {requirePermission}=require('../middleware/requirePermission'); const {csrfProtection}=require('../middleware/csrf');

router.get('/approvedPurchaseRequests',authenticate,requirePermission('purchase_order.view'), fetchApprovedPR);
router.get('/generate-po-number',authenticate,requirePermission('purchase_order.create'), fetchNextPONumber);
router.get('/purchase-orders/drafted-purchase-orders',authenticate,requirePermission('purchase_order.view'), draftedPurchaseOrders);
router.get('/purchase-orders/approved-purchase-orders',authenticate,requirePermission('purchase_order.view'), approvedPurchaseOrders);
router.get('/purchase-orders/:id',authenticate,requirePermission('purchase_order.view'), fetchPurchaseOrderById);
router.post('/new-purchase-order',authenticate,csrfProtection,requirePermission('purchase_order.create'), newPurchaseOrder);
router.put('/purchase-orders/:id/updatePOStatus',authenticate,csrfProtection,requirePermission('purchase_order.approve'), updatePOStatus);

module.exports = router;
