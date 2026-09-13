const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getPermissionModules, getRolePermissionDetails, getUserPermissionDetails, updateRolePermissions, updateUserPermissions, updateUser, updateUserStatus, resetUserPassword, changeUserPassword, deleteUser } = require('../controller/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/create-new-user', authenticate, authorize('Admin'), createUser);
router.get('/users', authenticate, authorize('Admin'), getAllUsers);
router.get('/permission-modules', authenticate, authorize('Admin'), getPermissionModules);
router.get('/roles/:role/permissions', authenticate, authorize('Admin'), getRolePermissionDetails);
router.put('/roles/:role/permissions', authenticate, authorize('Admin'), updateRolePermissions);
router.get('/users/:id/permissions', authenticate, authorize('Admin'), getUserPermissionDetails);
router.put('/users/:id/permissions', authenticate, authorize('Admin'), updateUserPermissions);
router.put("/users/:id", authenticate, authorize('Admin'), updateUser);
router.patch("/users/:id/status", authenticate, authorize('Admin'), updateUserStatus);
router.post("/users/:id/reset-password", authenticate, authorize('Admin'), resetUserPassword);
router.post("/users/:id/change-password", authenticate, authorize('Admin'), changeUserPassword);
router.delete('/users/:id', authenticate, authorize('Admin'), deleteUser);

module.exports = router;
