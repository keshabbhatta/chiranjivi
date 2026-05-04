const asyncHandler = require("express-async-handler");
const OpenAI       = require("openai");
const DietPlan     = require("../models/DietPlan.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── POST /api/diet/generate ───────────────────────────────
const generateDietPlan = asyncHandler(async (req, res) => {
  const { goal, dietType, allergies, dislikedFoods, calorieGoal, duration, age, weight, height, conditions } = req.body;

  const prompt = `Create a ${duration || 7}-day personalized diet plan for a patient with these details:
Goal: ${goal || "maintenance"}
Diet type: ${dietType || "non-vegetarian"}
Allergies: ${(allergies || []).join(", ") || "none"}
Disliked foods: ${(dislikedFoods || []).join(", ") || "none"}
Daily calorie goal: ${calorieGoal || "2000"} kcal
Age: ${age || "not specified"}
Weight: ${weight || "not specified"} kg
Height: ${height || "not specified"} cm
Health conditions: ${(conditions || []).join(", ") || "none"}

Respond ONLY with valid JSON:
{
  "title": "...",
  "plan": [
    {
      "day": 1,
      "meals": [
        {"time": "Breakfast", "foods": ["food1","food2"], "calories": 400, "protein": 20, "carbs": 50, "fats": 10, "notes": "..."},
        {"time": "Lunch",     "foods": ["food1","food2"], "calories": 600, "protein": 30, "carbs": 70, "fats": 15, "notes": "..."},
        {"time": "Dinner",    "foods": ["food1","food2"], "calories": 500, "protein": 25, "carbs": 60, "fats": 12, "notes": "..."},
        {"time": "Snack",     "foods": ["food1"],         "calories": 200, "protein": 5,  "carbs": 30, "fats": 5,  "notes": "..."}
      ],
      "totalCalories": 1700,
      "waterIntake": "8 glasses",
      "tips": "..."
    }
  ]
}
Only include 3 days to keep the response short. The frontend can paginate.`;

  const completion = await openai.chat.completions.create({
    model:       "gpt-4o-mini",
    messages:    [{ role: "user", content: prompt }],
    max_tokens:  2000,
    temperature: 0.6,
  });

  const rawText = completion.choices[0]?.message?.content?.trim();
  let planData;

  try {
    planData = JSON.parse(rawText.replace(/```json|```/g, "").trim());
  } catch {
    res.status(500);
    throw new Error("Failed to parse AI diet plan response");
  }

  const dietPlan = await DietPlan.create({
    user:         req.user._id,
    title:        planData.title || `${goal} Plan`,
    goal:         goal || "maintenance",
    preferences:  { dietType, allergies, dislikedFoods, calorieGoal },
    duration:     duration || 7,
    plan:         planData.plan || [],
    aiGenerated:  true,
  });

  res.status(201).json({ success: true, message: "Diet plan generated", data: dietPlan });
});

// ── GET /api/diet ─────────────────────────────────────────
const getDietPlans = asyncHandler(async (req, res) => {
  const plans = await DietPlan.find({ user: req.user._id })
    .select("title goal duration isActive createdAt")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: plans });
});

// ── GET /api/diet/:id ─────────────────────────────────────
const getDietPlanById = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) { res.status(404); throw new Error("Diet plan not found"); }
  res.json({ success: true, data: plan });
});

// ── DELETE /api/diet/:id ──────────────────────────────────
const deleteDietPlan = asyncHandler(async (req, res) => {
  const plan = await DietPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!plan) { res.status(404); throw new Error("Diet plan not found"); }
  res.json({ success: true, message: "Diet plan deleted" });
});

module.exports = { generateDietPlan, getDietPlans, getDietPlanById, deleteDietPlan };
