const express = require("express");
const router  = express.Router();
const { getAllDoctors, getAllPatients, getProfile, updateProfile, uploadAvatar, changePassword } = require("../controllers/user.controller");
const { protect }  = require("../middleware/auth.middleware");
const { upload }   = require("../middleware/upload.middleware");

// Public route to get all doctors
router.get("/doctors", getAllDoctors);

router.use(protect);  // all other user routes are protected

router.get("/patients", getAllPatients);
router.get(  "/profile",         getProfile);
router.put(  "/profile",         updateProfile);
router.post( "/avatar",          upload.single("avatar"), uploadAvatar);
router.put(  "/change-password", changePassword);

module.exports = router;
