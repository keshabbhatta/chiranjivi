const express = require("express");
const router  = express.Router();
const { getDashboard, getAllUsers, updateUserRole, toggleUserStatus, deleteUser, verifyDoctor } = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect, adminOnly);  // ALL admin routes require login + admin role

router.get(   "/dashboard",              getDashboard);
router.get(   "/users",                  getAllUsers);
router.patch( "/users/:id/role",         updateUserRole);
router.patch( "/users/:id/status",       toggleUserStatus);
router.delete("/users/:id",              deleteUser);
router.patch( "/doctors/:id/verify",     verifyDoctor);

module.exports = router;
