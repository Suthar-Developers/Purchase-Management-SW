const express = require('express');
const router = express.Router();
const {newProject, getAllProjects, updateProject} = require("../controller/projectController");
const authenticate = require('../middleware/authenticate');
const { requirePermission } = require('../middleware/requirePermission');
const { csrfProtection } = require('../middleware/csrf');

router.post('/createProject', authenticate, csrfProtection, requirePermission('project.create'), newProject)
router.get('/projects', authenticate, requirePermission('project.view'), getAllProjects)
router.put('/projects/:id', authenticate, csrfProtection, requirePermission('project.edit'), updateProject)

module.exports = router;
