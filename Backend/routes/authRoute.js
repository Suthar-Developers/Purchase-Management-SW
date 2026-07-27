const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authenticate = require("../middleware/authenticate");

router.post('/login', authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

module.exports = router;