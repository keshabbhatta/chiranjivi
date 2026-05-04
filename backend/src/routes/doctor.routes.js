const express = require("express");
const router  = express.Router();
const { getDoctors, getDoctorById, getSpecializations, createDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctor.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get( "/",                getDoctors);
router.get( "/specializations", getSpecializations);
router.get( "/:id",             getDoctorById);
router.post("/",        protect, adminOnly, createDoctor);
router.put( "/:id",     protect, adminOnly, updateDoctor);
router.delete("/:id",   protect, adminOnly, deleteDoctor);

module.exports = router;
