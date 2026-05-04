const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  time:        String,       // "Breakfast", "Lunch", "Dinner", "Snack"
  foods:       [String],
  calories:    Number,
  protein:     Number,       // grams
  carbs:       Number,
  fats:        Number,
  notes:       String,
});

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    },
    title:   { type: String, default: "My Diet Plan" },
    goal:    {
      type: String,
      enum: ["weight_loss", "weight_gain", "maintenance", "muscle_building", "diabetes", "heart_health", "custom"],
      default: "maintenance",
    },
    preferences: {
      dietType:    { type: String, enum: ["vegetarian", "vegan", "non-vegetarian", "pescatarian"], default: "non-vegetarian" },
      allergies:   [String],
      dislikedFoods:[String],
      calorieGoal: Number,
    },
    duration:   { type: Number, default: 7 },      // days
    plan: [
      {
        day:   Number,
        meals: [mealSchema],
        totalCalories: Number,
        waterIntake:   String,
        tips:          String,
      },
    ],
    aiGenerated: { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);
