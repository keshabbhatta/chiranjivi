const asyncHandler = require("express-async-handler");
const Doctor       = require("../models/Doctor.model");

// ── GET /api/doctors ──────────────────────────────────────
const getDoctors = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip  = (page - 1) * limit;

  const query = { isVerified: true };

  if (req.query.specialization) query.specialization = new RegExp(req.query.specialization, "i");
  if (req.query.city)           query["location.city"] = new RegExp(req.query.city, "i");
  if (req.query.available)      query.available = req.query.available === "true";

  // text search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const sortOptions = {
    rating:     { rating: -1 },
    experience: { experience: -1 },
    fee_low:    { consultationFee: 1 },
    fee_high:   { consultationFee: -1 },
  };
  const sort = sortOptions[req.query.sort] || { rating: -1 };

  const [doctors, total] = await Promise.all([
    Doctor.find(query).sort(sort).skip(skip).limit(limit),
    Doctor.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: doctors,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// ── GET /api/doctors/:id ──────────────────────────────────
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) { res.status(404); throw new Error("Doctor not found"); }
  res.json({ success: true, data: doctor });
});

// ── GET /api/doctors/specializations ─────────────────────
const getSpecializations = asyncHandler(async (req, res) => {
  const specs = await Doctor.distinct("specialization");
  res.json({ success: true, data: specs.sort() });
});

// ── POST /api/doctors (admin only) ───────────────────────
const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, message: "Doctor created", data: doctor });
});

// ── PUT /api/doctors/:id (admin only) ────────────────────
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) { res.status(404); throw new Error("Doctor not found"); }
  res.json({ success: true, message: "Doctor updated", data: doctor });
});

// ── DELETE /api/doctors/:id (admin only) ─────────────────
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) { res.status(404); throw new Error("Doctor not found"); }
  res.json({ success: true, message: "Doctor deleted" });
});

module.exports = { getDoctors, getDoctorById, getSpecializations, createDoctor, updateDoctor, deleteDoctor };
