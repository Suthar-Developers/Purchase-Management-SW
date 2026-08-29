const express = require('express');
const router = express.Router();
const { newMaterial, getAllMaterials, newCategory, getAllCategories } = require("../controller/materialsController");

router.post('/materials/add-material', newMaterial)
router.get('/materials/material-list', getAllMaterials)
router.post('/materials/add-material-category', newCategory)
router.get('/materials/material-category-list', getAllCategories)

module.exports = router;