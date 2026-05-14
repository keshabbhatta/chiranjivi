const asyncHandler = require("express-async-handler");
const LabReport = require("../models/LabReport.model");

// @desc    Create a new lab report
// @route   POST /api/lab-reports
const createReport = asyncHandler(async (req, res) => {
  const { title, results } = req.body;

  if (!results) {
    res.status(400);
    throw new Error("Report results data is missing.");
  }

  // Safely parse the results string coming from FormData
  let parsedResults;
  try {
    parsedResults = typeof results === "string" ? JSON.parse(results) : results;
  } catch (err) {
    res.status(400);
    throw new Error("Invalid results format. Must be valid JSON.");
  }

  const report = await LabReport.create({
    user: req.user._id,
    title: title || "AI Lab Report Analysis",
    results: parsedResults
  });

  res.status(201).json({ success: true, data: report });
});

// @desc    Get user's lab reports
// @route   GET /api/lab-reports
const getReports = asyncHandler(async (req, res) => {
  // .sort({ createdAt: -1 }) ensures the newest reports show at the top of the Profile
  const reports = await LabReport.find({ user: req.user._id }).sort({ createdAt: -1 });
  
  // Return 'reports' array directly in the object so frontend maps it easily
  res.status(200).json({ success: true, reports: reports });
});

// @desc    Delete a lab report
// @route   DELETE /api/lab-reports/:id
const deleteReport = asyncHandler(async (req, res) => {
  const report = await LabReport.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Ensure the user trying to delete it is the one who created it
  if (report.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this report");
  }

  await report.deleteOne();

  res.status(200).json({ success: true, id: req.params.id });
});

module.exports = { createReport, getReports, deleteReport };