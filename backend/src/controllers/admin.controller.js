const asyncHandler  = require("express-async-handler");
const User          = require("../models/User.model");
const Doctor        = require("../models/Doctor.model");
const SymptomCheck  = require("../models/SymptomCheck.model");
const LabReport     = require("../models/LabReport.model");
const Chat          = require("../models/Chat.model");
const DietPlan      = require("../models/DietPlan.model");

// ── GET /api/admin/dashboard ──────────────────────────────
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalDoctors, totalSymptomChecks,
    totalLabReports, totalChats, totalDietPlans,
    newUsersThisMonth, activeUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Doctor.countDocuments(),
    SymptomCheck.countDocuments(),
    LabReport.countDocuments(),
    Chat.countDocuments(),
    DietPlan.countDocuments(),
    User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
  ]);

  res.json({
    success: true,
    data: {
      stats: { totalUsers, totalDoctors, totalSymptomChecks, totalLabReports, totalChats, totalDietPlans, newUsersThisMonth, activeUsers },
    },
  });
});

// ── GET /api/admin/users ──────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 20;
  const skip   = (page - 1) * limit;
  const search = req.query.search;

  const query = {};
  if (search) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  if (req.query.role) query.role = req.query.role;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// ── PATCH /api/admin/users/:id/role ──────────────────────
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "doctor", "admin"].includes(role)) {
    res.status(400); throw new Error("Invalid role");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ success: true, message: `Role updated to ${role}`, data: user });
});

// ── PATCH /api/admin/users/:id/status ────────────────────
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}`, data: user });
});

// ── DELETE /api/admin/users/:id ───────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  // Clean up user data
  await Promise.all([
    SymptomCheck.deleteMany({ user: req.params.id }),
    LabReport.deleteMany({ user: req.params.id }),
    Chat.deleteMany({ user: req.params.id }),
    DietPlan.deleteMany({ user: req.params.id }),
  ]);
  res.json({ success: true, message: "User and all data deleted" });
});

// ── PATCH /api/admin/doctors/:id/verify ──────────────────
const verifyDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  if (!doctor) { res.status(404); throw new Error("Doctor not found"); }
  res.json({ success: true, message: "Doctor verified", data: doctor });
});

module.exports = { getDashboard, getAllUsers, updateUserRole, toggleUserStatus, deleteUser, verifyDoctor };
