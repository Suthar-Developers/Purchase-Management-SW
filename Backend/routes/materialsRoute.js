const express = require('express');
const router = express.Router();
const { newMaterial, getAllMaterials, newCategory, getAllCategories, newUnit, getAllUnits } = require("../controller/materialsController");

router.post('/materials/add-material', newMaterial)
router.get('/materials/material-list', getAllMaterials)
router.post('/materials/add-material-category', newCategory)
router.get('/materials/material-category-list', getAllCategories)
router.post('/materials/add-material-unit', newUnit)
router.get('/materials/material-unit-list', getAllUnits)

module.exports = router;