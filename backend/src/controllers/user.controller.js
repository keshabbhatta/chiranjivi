const asyncHandler = require("express-async-handler");
const User         = require("../models/User.model");
const { uploadToCloudinary } = require("../middleware/upload.middleware");

// ── GET /api/users/profile ────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
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

module.exports = { getProfile, updateProfile, uploadAvatar, changePassword };
