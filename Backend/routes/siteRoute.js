const express = require('express');
const router = express.Router();
const {newSite, getAllSites} = require("../controller/siteController");

router.post('/createSite', newSite)
router.get('/sites', getAllSites)

module.exports = router;