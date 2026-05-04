const express = require("express");
const router  = express.Router();
const { getProfile, updateProfile, uploadAvatar, changePassword } = require("../controllers/user.controller");
const { protect }  = require("../middleware/auth.middleware");
const { upload }   = require("../middleware/upload.middleware");

router.use(protect);  // all user routes are protected

router.get(  "/profile",         getProfile);
router.put(  "/profile",         updateProfile);
router.post( "/avatar",          upload.single("avatar"), uploadAvatar);
router.put(  "/change-password", changePassword);

module.exports = router;
