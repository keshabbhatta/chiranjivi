const asyncHandler = require("express-async-handler");
const User         = require("../models/User.model");
const Doctor       = require("../models/Doctor.model");
const { uploadToCloudinary } = require("../middleware/upload.middleware");

// ── GET /api/users/doctors (for patient chat listing) ─────
const getAllDoctors = asyncHandler(async (req, res) => {
  const filter = { role: "doctor" };
  if (req.user && req.user.id) {
    filter._id = { $ne: req.user.id };
  }

  const doctors = await User.find(filter)
    .select("_id name doctorUsername avatar isOnline email")
    .sort({ createdAt: -1 });

  // Optionally fetch specialization from Doctor model
  const enrichedDoctors = await Promise.all(
    doctors.map(async (doctor) => {
      const doctorProfile = await Doctor.findOne({ user: doctor._id });
      return {
        _id: doctor._id,
        name: doctor.name,
        doctorUsername: doctor.doctorUsername,
        avatar: doctor.avatar,
        isOnline: doctor.isOnline,
        email: doctor.email,
        specialization: doctorProfile?.specialization || "General Practitioner",
        experience: doctorProfile?.experience || 0,
        rating: doctorProfile?.rating || 0,
      };
    })
  );

  res.json({ success: true, doctors: enrichedDoctors });
});

// ── GET /api/users/profile ────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// ── GET /api/user/patients (for doctor chat fallback) ─────
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await User.find({ role: "user", _id: { $ne: req.user.id } })
    .select("_id name avatar isOnline email")
    .sort({ createdAt: -1 });

  res.json({ success: true, patients });
});

// ── PUT /api/users/profile ────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name","phone","dateOfBirth","gender","bloodGroup",
    "allergies","chronicConditions","emergencyContact",
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new:              true,
    runValidators:    true,
  });

  res.json({ success: true, message: "Profile updated", user });
});

// ── POST /api/users/avatar ────────────────────────────────
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  const result = await uploadToCloudinary(req.file.buffer, "healthcare/avatars", "image");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true }
  );

  res.json({ success: true, message: "Avatar updated", avatar: user.avatar, user });
});

// ── PUT /api/users/change-password ───────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password changed successfully" });
});

module.exports = { getAllDoctors, getAllPatients, getProfile, updateProfile, uploadAvatar, changePassword };
