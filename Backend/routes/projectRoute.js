const express = require('express');
const router = express.Router();
const {newProject, getAllProjects} = require("../controller/projectController");

router.post('/createProject', newProject)
router.get('/projects', getAllProjects)

module.exports = router;