const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, deleteUser } = require('../controller/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/create-new-user', authenticate, authorize(1), createUser);
router.get('/users', authenticate, authorize(1), getAllUsers);
router.delete('/users/:id', authenticate, authorize(1), deleteUser);

module.exports = router;
