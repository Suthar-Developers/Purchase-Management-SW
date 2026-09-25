const express = require("express");
const router = express.Router();

const { getAllCompanyGST } = require("../controller/companyGstController");
const authenticate = require("../middleware/authenticate");

router.get(
    "/company-gst",
    authenticate,
    getAllCompanyGST
);

module.exports = router;