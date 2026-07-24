const express = require('express');
const router = express.Router();
const { createUser } = require('../controller/userController');
const authenticate = require('../middleware/authenticate');
const { requirePermission } = require('../middleware/requirePermission');
const { csrfProtection } = require('../middleware/csrf');

router.post('/create-new-user', authenticate, csrfProtection, requirePermission('user.create'), createUser);

module.exports = router;
