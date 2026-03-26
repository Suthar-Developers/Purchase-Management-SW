const express = require('express')
const router = express.Router()
const purchaseRequestController = require('../controller/purchaseRequestController')

router.post('/createPurchaseRequest', purchaseRequestController);

module.exports = router;