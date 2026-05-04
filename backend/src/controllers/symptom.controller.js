const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const SymptomCheck = require("../models/SymptomCheck.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const checkSymptoms = asyncHandler(async (req, res) => {
  let { symptoms, age, gender, duration, severity } = req.body;

  if (!symptoms) {
    res.status(400);
    throw new Error("Please provide symptoms");
  }

  // Handle both array and comma-separated string formats
  const symptomsArray = Array.isArray(symptoms) 
    ? symptoms 
    : symptoms.split(',').map(s => s.trim()).filter(Boolean);

  const prompt = `You are a medical AI assistant. A patient reports the following:
Symptoms: ${symptomsArray.join(", ")}
Age: ${age || "not specified"}
Gender: ${gender || "not specified"}
Duration: ${duration || "not specified"}
Severity: ${severity || "medium"}

Respond ONLY with a valid JSON object in this exact format:
{
  "predicted_disease": "Condition Name",
  "description": "Comprehensive short description",
  "precautions": ["Actionable precaution 1", "Actionable precaution 2"],
  "medications": ["Specific medicine name or clinical therapy"],
  "diet": ["Nutrient or food type 1", "Nutrient or food type 2"],
  "workout": ["Activity or rest suggestion 1"],
  "urgencyLevel": "low|medium|high|emergency"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
      response_format: { type: "json_object" } 
    });

    const rawContent = completion.choices[0].message.content;
    const aiResponse = JSON.parse(rawContent.replace(/```json|```/g, "").trim());

    // Save to Mongo
    const record = await SymptomCheck.create({
      user: req.user ? req.user._id : null,
      symptoms: symptomsArray,
      additionalInfo: { age, gender, duration, severity: severity || "medium" },
      aiResponse: aiResponse,
      rawAiText: rawContent,
    });

    // Return exact keys as expected by the frontend
    return res.status(201).json({ success: true, ...aiResponse });

  } catch (err) {
    console.error("Diagnosis process failed:", err);
    res.status(500);
    throw new Error(err.message || "Failed to analyze symptoms.");
  }
});

module.exports = { checkSymptoms };