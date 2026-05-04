const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    },
    title:       { type: String, required: true },
    testType:    { type: String, required: true },   // e.g. "Blood Test", "MRI"
    reportDate:  { type: Date, required: true },
    labName:     { type: String, default: "" },
    doctorName:  { type: String, default: "" },
    fileUrl:     { type: String, default: "" },      // Cloudinary URL
    filePublicId:{ type: String, default: "" },      // Cloudinary public_id for deletion
    fileType:    { type: String, enum: ["image", "pdf", "other"], default: "image" },
    results: [
      {
        parameter: String,
        value:     String,
        unit:      String,
        normalRange: String,
        status:    { type: String, enum: ["normal", "high", "low", "critical"], default: "normal" },
      },
    ],
    aiAnalysis: {
      summary:         String,
      keyFindings:     [String],
      recommendation:  String,
      analyzedAt:      Date,
    },
    notes:   { type: String, default: "" },
    isShared:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabReport", labReportSchema);
