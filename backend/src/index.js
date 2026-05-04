// ─────────────────────────────────────────────────────────
//  Healthcare App — Express Server Entry Point
// ─────────────────────────────────────────────────────────
require("dotenv").config();
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is missing in .env");
}
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");
const connectDB  = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Route imports ─────────────────────────────────────────
const authRoutes       = require("./routes/auth.routes");
const userRoutes       = require("./routes/user.routes");
const symptomRoutes    = require("./routes/symptom.routes");
const labReportRoutes  = require("./routes/labReport.routes");
const chatRoutes       = require("./routes/chat.routes");
const doctorRoutes     = require("./routes/doctor.routes");
const dietRoutes       = require("./routes/diet.routes");
const adminRoutes      = require("./routes/admin.routes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect MongoDB ───────────────────────────────────────
connectDB();

// ── Global Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods:     ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Rate Limiter (global) ─────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  message:  { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Healthcare API is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/symptoms",   symptomRoutes);
app.use("/api/lab-reports",labReportRoutes);
app.use("/api/chat",       chatRoutes);
app.use("/api/doctors",    doctorRoutes);
app.use("/api/diet",       dietRoutes);
app.use("/api/admin",      adminRoutes);

// ── Predict route (unprotected) ───────────────────────────
app.post("/predict", async (req, res) => {
  let { symptoms, age, gender, duration, severity } = req.body;

  if (!symptoms) {
    return res.status(400).json({ message: "Please provide symptoms" });
  }

  const symptomsArray = Array.isArray(symptoms) 
    ? symptoms 
    : symptoms.split(',').map(s => s.trim()).filter(s => s !== "");

  const prompt = `You are a medical AI assistant. A patient reports the following:
Symptoms: ${symptomsArray.join(", ")}
Age: ${age || "not specified"}
Gender: ${gender || "not specified"}
Duration: ${duration || "not specified"}
Severity: ${severity || "mild"}

Respond ONLY with a valid JSON object in this exact format:
{
  "predicted_disease": "Main Condition Name",
  "description": "Short description of the condition",
  "precautions": ["precaution 1", "precaution 2"],
  "medications": ["medication 1"],
  "diet": ["diet 1"],
  "workout": ["workout 1"],
  "urgencyLevel": "low|medium|high|emergency"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res.status(500).json({ message: `Error predicting disease: ${error.message}` });
  }
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🏥 Healthcare Backend running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🩺 Health:   http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
