const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, default: "Lab Report" },
  testType: { type: String, default: "" },
  reportDate: { type: Date, default: Date.now },

  labName: { type: String, default: "" },
  doctorName: { type: String, default: "" },

  fileUrl: { type: String, default: "" },
  filePublicId: { type: String, default: "" },
  fileType: { type: String, default: "image" },

  results: { type: Object, default: {} },

  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("LabReport", labReportSchema);