const express = require('express');
const router = express.Router();
const {newProject, getAllProjects, updateProject} = require("../controller/projectController");
const authenticate = require('../middleware/authenticate');

router.post('/createProject', newProject)
router.get('/projects', authenticate, getAllProjects)
router.put('/projects/:id', updateProject)

module.exports = router;