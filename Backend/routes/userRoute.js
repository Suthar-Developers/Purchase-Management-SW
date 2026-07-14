const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controller/userController');

router.post('/create-new-user', createUser);
router.post('/login-user', loginUser)

module.exports = router;