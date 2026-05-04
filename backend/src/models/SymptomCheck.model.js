const mongoose = require("mongoose");

const symptomCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false, 
    },
    symptoms: [{ type: String, required: true }],
    additionalInfo: {
      age:      Number,
      gender:   String,
      duration: String,
      severity: { type: String, default: "medium" },
    },
    aiResponse: {
      predicted_disease: { type: String, required: true },
      description:       { type: String },
      precautions:       [{ type: String }],
      medications:       [{ type: String }],
      diet:              [{ type: String }],
      workout:           [{ type: String }],
      urgencyLevel:      { type: String, default: "medium" },
    },
    rawAiText: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomCheck", symptomCheckSchema);