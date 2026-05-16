const asyncHandler = require("express-async-handler");
const axios = require("axios");

const generateDietPlan = asyncHandler(async (req, res) => {
  const { goal, dietType, allergies, dislikedFoods, calorieGoal, duration, age, weight, height, conditions } = req.body;

  const promptText = `
    Create a ${duration}-day ${dietType} diet plan for a ${age} year old, weighing ${weight}kg, height ${height}cm. 
    Goal: ${goal}. Calorie goal: ${calorieGoal} kcal.
    Allergies: ${allergies && allergies.length ? allergies.join(", ") : "None"}. 
    Dislikes: ${dislikedFoods && dislikedFoods.length ? dislikedFoods.join(", ") : "None"}. 
    Medical Conditions: ${conditions && conditions.length ? conditions.join(", ") : "None"}.
    
    Return ONLY a valid JSON response in this exact format:
    {
      "title": "Your Personalized Diet Plan",
      "plan": [
        {
          "day": 1,
          "waterIntake": "3 liters",
          "tips": "Drink a glass of water before meals.",
          "meals": [
            {
              "time": "Breakfast",
              "foods": ["Oatmeal", "Banana"],
              "calories": 350,
              "protein": 12,
              "carbs": 60,
              "fats": 5
            }
          ]
        }
      ]
    }
  `;

  try {
    // Use a supported Gemini text model and endpoint.
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }],
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    const cleanJson = text.replaceAll("```json", "").replaceAll("```", "").trim();
    const dietData = JSON.parse(cleanJson);

    res.json({
      success: true,
      data: dietData,
    });
  } catch (error) {
    // Google ले पठाएको सक्कली एरर म्यासेज तान्ने
    const googleError = error.response?.data?.error?.message || error.message;
    console.error("Gemini Error:", googleError);
    
    res.status(500).json({
      message: `Gemini API Error: ${googleError}`
    });
  }
});

const getDietPlans = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

const getDietPlanById = asyncHandler(async (req, res) => {
  res.json({ success: true, data: {} });
});

const deleteDietPlan = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Diet plan deleted successfully" });
});

module.exports = {
  generateDietPlan,
  getDietPlans,
  getDietPlanById,
  deleteDietPlan,
};