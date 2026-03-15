const express = require('express');
const router = express.Router();
const {newProject, getAllProjects, updateProject} = require("../controller/projectController");

router.post('/createProject', newProject)
router.get('/projects', getAllProjects)
router.put('/projects/:id', updateProject)

module.exports = router;