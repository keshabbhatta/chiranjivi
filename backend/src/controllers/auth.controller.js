const asyncHandler = require("express-async-handler");
const jwt          = require("jsonwebtoken");
const crypto       = require("crypto");
const User         = require("../models/User.model");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ── POST /api/auth/register ───────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "user" : role || "user",  // prevent self-admin
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token:   generateToken(user._id),
    user,
  });
});

// ── POST /api/auth/login ──────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account has been deactivated");
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ── GET /api/auth/me ──────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// ── POST /api/auth/forgot-password ───────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("No account found with that email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken   = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  // In production: send email with resetToken link
  // For now just return token in dev
  res.json({
    success: true,
    message: "Reset token generated (send via email in production)",
    ...(process.env.NODE_ENV === "development" && { resetToken }),
  });
});

// ── POST /api/auth/reset-password/:token ─────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:   hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or has expired");
  }

  user.password             = req.body.password;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successful",
    token:   generateToken(user._id),
  });
});

module.exports = { register, login, getMe, forgotPassword, resetPassword };
