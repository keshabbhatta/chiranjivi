const asyncHandler  = require("express-async-handler");
const OpenAI        = require("openai");
const LabReport     = require("../models/LabReport.model");
const cloudinary    = require("../config/cloudinary");
const { uploadToCloudinary } = require("../middleware/upload.middleware");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── POST /api/lab-reports ─────────────────────────────────
const createReport = asyncHandler(async (req, res) => {
  const { title, testType, reportDate, labName, doctorName, notes, results } = req.body;

  let fileUrl = "", filePublicId = "", fileType = "other";

  if (req.file) {
    const folder       = "healthcare/lab-reports";
    const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "image";
    const uploaded     = await uploadToCloudinary(req.file.buffer, folder, resourceType);
    fileUrl      = uploaded.secure_url;
    filePublicId = uploaded.public_id;
    fileType     = resourceType === "raw" ? "pdf" : "image";
  }

  const report = await LabReport.create({
    user: req.user._id,
    title, testType, reportDate, labName, doctorName, notes,
    fileUrl, filePublicId, fileType,
    results: results ? JSON.parse(results) : [],
  });

  res.status(201).json({ success: true, message: "Lab report uploaded", data: report });
});

// ── GET /api/lab-reports ──────────────────────────────────
const getReports = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  const query = { user: req.user._id };
  if (req.query.testType) query.testType = req.query.testType;

  const [reports, total] = await Promise.all([
    LabReport.find(query).sort({ reportDate: -1 }).skip(skip).limit(limit),
    LabReport.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: reports,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// ── GET /api/lab-reports/:id ──────────────────────────────
const getReportById = asyncHandler(async (req, res) => {
  const report = await LabReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) { res.status(404); throw new Error("Report not found"); }
  res.json({ success: true, data: report });
});

// ── POST /api/lab-reports/:id/analyze ────────────────────
const analyzeReport = asyncHandler(async (req, res) => {
  const report = await LabReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) { res.status(404); throw new Error("Report not found"); }

  const resultsText = report.results.length
    ? report.results.map((r) => `${r.parameter}: ${r.value} ${r.unit} (Normal: ${r.normalRange}) — ${r.status}`).join("\n")
    : "No structured results provided.";

  const prompt = `Analyze this medical lab report and respond ONLY in valid JSON:
Report Type: ${report.testType}
Lab Results:
${resultsText}

JSON format:
{
  "summary": "...",
  "keyFindings": ["finding1", "finding2"],
  "recommendation": "...",
}`;

  const completion = await openai.chat.completions.create({
    model:       "gpt-4o-mini",
    messages:    [{ role: "user", content: prompt }],
    max_tokens:  600,
    temperature: 0.3,
  });

  const rawText = completion.choices[0]?.message?.content?.trim();
  let analysis;

  try {
    analysis = JSON.parse(rawText.replace(/```json|```/g, "").trim());
  } catch {
    analysis = { summary: rawText, keyFindings: [], recommendation: "" };
  }

  report.aiAnalysis = { ...analysis, analyzedAt: new Date() };
  await report.save();

  res.json({ success: true, message: "Report analyzed", data: report });
});

// ── DELETE /api/lab-reports/:id ───────────────────────────
const deleteReport = asyncHandler(async (req, res) => {
  const report = await LabReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) { res.status(404); throw new Error("Report not found"); }

  if (report.filePublicId) {
    await cloudinary.uploader.destroy(report.filePublicId);
  }

  await report.deleteOne();
  res.json({ success: true, message: "Report deleted" });
});

module.exports = { createReport, getReports, getReportById, analyzeReport, deleteReport };
