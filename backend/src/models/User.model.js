const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Name is required"], trim: true,
    },
    email: {
      type: String, required: [true, "Email is required"],
      unique: true, lowercase: true, trim: true,
    },
    password: {
      type: String, required: [true, "Password is required"], minlength: 6, select: false,
    },
    role: {
      type: String, enum: ["user", "doctor", "admin"], default: "user",
    },
    doctorUsername: {
      type: String, unique: true, sparse: true, lowercase: true, trim: true,
    },
    avatar: {
      type: String, default: "",
    },
    phone: { type: String, default: "" },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", ""] , default: "" },
    bloodGroup: { type: String, default: "" },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    emergencyContact: {
      name:  { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    isOnline: { type: Boolean, default: false },
    lastLogin: { type: Date },
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields in JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
