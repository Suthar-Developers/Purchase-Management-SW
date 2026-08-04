const express = require('express');
const router = express.Router();
const { createUser, getUsers, deleteUser } = require('../controller/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/users', authenticate, authorize(1), getUsers);
router.post('/create-new-user', authenticate, authorize(1), createUser);
router.delete('/users/:id', authenticate, authorize(1), deleteUser);

module.exports = router;
