const express = require('express')
const router = express.Router()
const { fetchApprovedPR, fetchNextPONumber, newPurchaseOrder, draftedPurchaseOrders, approvedPurchaseOrders, fetchPurchaseOrderById, updatePOStatus } = require('../controller/purchaseOrderController')
const authenticate = require('../middleware/authenticate')
const permissionAuthorize = require('../middleware/permissionAuthorize')

router.get('/approvedPurchaseRequests', authenticate, permissionAuthorize('purchase_orders', 'create'), fetchApprovedPR);
router.get('/generate-po-number', authenticate, permissionAuthorize('purchase_orders', 'create'), fetchNextPONumber);
router.get('/purchase-orders/drafted-purchase-orders', authenticate, permissionAuthorize('purchase_orders', 'view'), draftedPurchaseOrders);
router.get('/purchase-orders/approved-purchase-orders', authenticate, permissionAuthorize('purchase_orders', 'view'), approvedPurchaseOrders);
router.get('/purchase-orders/:id', authenticate, permissionAuthorize('purchase_orders', 'view'), fetchPurchaseOrderById);
router.post('/new-purchase-order', authenticate, permissionAuthorize('purchase_orders', 'create'), newPurchaseOrder);
router.put('/purchase-orders/:id/updatePOStatus', authenticate, permissionAuthorize('purchase_orders', 'approve'), updatePOStatus);

module.exports = router;
