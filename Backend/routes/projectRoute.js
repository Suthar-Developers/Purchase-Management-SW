const express = require('express');
const router = express.Router();
const {newProject, getAllProjects, updateProject} = require("../controller/projectController");
const authenticate = require('../middleware/authenticate');
const permissionAuthorize = require('../middleware/permissionAuthorize');

router.post('/createProject', authenticate, permissionAuthorize('projects', 'create'), newProject)
router.get('/projects', authenticate, permissionAuthorize('projects', 'view'), getAllProjects)
router.put('/projects/:id', authenticate, permissionAuthorize('projects', 'edit'), updateProject)

module.exports = router;
