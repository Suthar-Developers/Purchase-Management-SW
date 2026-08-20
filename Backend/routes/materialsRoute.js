const express = require('express');
const router = express.Router();
const { newMaterial, getAllMaterials } = require("../controller/materialsController");

router.post('/materials/add-material', newMaterial)
router.get('/materials/material-list', getAllMaterials)

module.exports = router;