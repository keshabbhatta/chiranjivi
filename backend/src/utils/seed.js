require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("../models/User.model");
const Doctor   = require("../models/Doctor.model");

const connectDB = require("../config/db");

const seedData = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");

  // Clear existing
  await User.deleteMany({});
  await Doctor.deleteMany({});

  // Create admin
  const admin = await User.create({
    name:     "Admin User",
    email:    "admin@healthcare.com",
    password: "Admin@123",
    role:     "admin",
  });
  console.log("✅ Admin created:", admin.email);

  // Create test user
  const user = await User.create({
    name:     "Test Patient",
    email:    "patient@healthcare.com",
    password: "Patient@123",
    role:     "user",
  });
  console.log("✅ Test user created:", user.email);

  // Create sample doctors
  const doctors = [
    { name:"Dr. Sarah Johnson",  specialization:"Cardiologist",      qualification:"MBBS, MD Cardiology",   experience:12, hospital:"City Heart Hospital",    location:{city:"New York"},  consultationFee:150, rating:4.8, reviews:234, available:true, isVerified:true },
    { name:"Dr. Michael Chen",   specialization:"Neurologist",       qualification:"MBBS, DM Neurology",    experience:8,  hospital:"Brain & Spine Center",   location:{city:"Los Angeles"},consultationFee:130, rating:4.7, reviews:189, available:true, isVerified:true },
    { name:"Dr. Priya Sharma",   specialization:"Dermatologist",     qualification:"MBBS, MD Dermatology",  experience:6,  hospital:"SkinCare Clinic",        location:{city:"Chicago"},   consultationFee:100, rating:4.9, reviews:312, available:true, isVerified:true },
    { name:"Dr. James Wilson",   specialization:"Orthopedic Surgeon",qualification:"MBBS, MS Orthopedics",  experience:15, hospital:"Joint Care Hospital",    location:{city:"Houston"},   consultationFee:180, rating:4.6, reviews:145, available:true, isVerified:true },
    { name:"Dr. Aisha Patel",    specialization:"Pediatrician",      qualification:"MBBS, MD Pediatrics",   experience:9,  hospital:"Children's Health Center",location:{city:"Phoenix"},   consultationFee:90,  rating:4.9, reviews:421, available:true, isVerified:true },
    { name:"Dr. Robert Garcia",  specialization:"General Physician", qualification:"MBBS, FCPS",            experience:10, hospital:"City Medical Center",    location:{city:"New York"},  consultationFee:70,  rating:4.5, reviews:567, available:true, isVerified:true },
    { name:"Dr. Linda Kim",      specialization:"Gynecologist",      qualification:"MBBS, MS Gynecology",   experience:11, hospital:"Women's Health Clinic",  location:{city:"Seattle"},   consultationFee:120, rating:4.7, reviews:298, available:true, isVerified:true },
    { name:"Dr. Ahmed Hassan",   specialization:"Diabetologist",     qualification:"MBBS, MD Endocrinology",experience:7,  hospital:"Diabetes Care Center",   location:{city:"Boston"},    consultationFee:110, rating:4.6, reviews:176, available:true, isVerified:true },
  ];

  await Doctor.insertMany(doctors);
  console.log(`✅ ${doctors.length} doctors seeded`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────────");
  console.log("Admin   : admin@healthcare.com  / Admin@123");
  console.log("Patient : patient@healthcare.com / Patient@123");
  console.log("─────────────────────────────────\n");

  process.exit(0);
};

seedData().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
