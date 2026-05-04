const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name:           { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    qualification:  { type: String, required: true },
    experience:     { type: Number, default: 0 },   // years
    hospital:       { type: String, default: "" },
    location: {
      city:    { type: String, default: "" },
      address: { type: String, default: "" },
    },
    consultationFee: { type: Number, default: 0 },
    avatar:    { type: String, default: "" },
    phone:     { type: String, default: "" },
    email:     { type: String, default: "" },
    rating:    { type: Number, default: 0, min: 0, max: 5 },
    reviews:   { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    availableSlots: [
      {
        day:       String,
        startTime: String,
        endTime:   String,
      },
    ],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Full text search index
doctorSchema.index({ name: "text", specialization: "text", hospital: "text" });

module.exports = mongoose.model("Doctor", doctorSchema);
