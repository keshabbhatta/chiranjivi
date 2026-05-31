const express = require("express");
const router  = express.Router();
const { getDoctors, getDoctorById, getSpecializations, createDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctor.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const User = require("../models/User.model");

// GET all doctors (combined from User collection and Doctor collection)
router.get("/", async (req, res) => {
  try {
    // Get doctors from User collection who registered as doctors
    const userDoctors = await User.find({ role: "doctor" })
      .select("_id name email avatar role phone")
      .lean();

    // Format response
    const doctors = userDoctors.map(doc => ({
      _id: doc._id,
      name: doc.name,
      email: doc.email,
      avatar: doc.avatar,
      role: "doctor",
      phone: doc.phone,
      source: "user_profile"
    }));

    res.json({
      success: true,
      doctors: doctors,
      total: doctors.length
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: process.env.NODE_ENV === "development" ? error.message : ""
    });
  }
});

router.get( "/specializations", getSpecializations);
router.get( "/:id",             getDoctorById);
router.post("/",        protect, adminOnly, createDoctor);
router.put( "/:id",     protect, adminOnly, updateDoctor);
router.delete("/:id",   protect, adminOnly, deleteDoctor);

module.exports = router;
