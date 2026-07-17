const express = require('express');
const router = express.Router();
const { createUser } = require('../controller/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/create-new-user', authenticate, authorize(1), createUser);

module.exports = router;