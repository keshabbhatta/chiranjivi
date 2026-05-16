import React, { useState } from "react";

// तस्बिरलाई Base64 स्ट्रिङमा बदल्ने Helper Function
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};

export default function DietRecommender() {
  // =========================
  // STATE
  // =========================
  const [formData, setFormData] = useState({
    goal: "maintenance",
    dietType: "non-vegetarian",
    allergies: "",
    dislikedFoods: "",
    calorieGoal: "",
    duration: 7,
    age: "",
    weight: "",
    height: "",
    conditions: "",
  });

  const [dietPlan, setDietPlan] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [foodAnalysis, setFoodAnalysis] = useState("");
  
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // लगइन टोकन

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFoodAnalysis(""); 
  };

  // =========================
  // GENERATE DIET PLAN
  // =========================
  const generateDietPlan = async (e) => {
    e.preventDefault();
    try {
      setLoadingDiet(true);
      setError("");
      setDietPlan(null); // पुरानो डाटा हटाउने

      const response = await fetch("http://localhost:5000/api/diet/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", 
        },
        body: JSON.stringify({
          ...formData,
          calorieGoal: Number(formData.calorieGoal),
          duration: Number(formData.duration),
          age: Number(formData.age),
          weight: Number(formData.weight),
          height: Number(formData.height),
          // कमा (,) ले छुट्याएका कुराहरूलाई Array मा बदल्ने
          allergies: formData.allergies ? formData.allergies.split(",").map((a) => a.trim()) : [],
          dislikedFoods: formData.dislikedFoods ? formData.dislikedFoods.split(",").map((a) => a.trim()) : [],
          conditions: formData.conditions ? formData.conditions.split(",").map((a) => a.trim()) : [],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate diet plan");

      setDietPlan(data.data); // Backend ले पठाएको JSON डाटा
    } catch (err) {
      console.error(err);
      setError(err.message || "Diet plan failed. Server Error.");
    } finally {
      setLoadingDiet(false);
    }
  };

  // =========================
  // ANALYZE IMAGE
  // =========================
  const analyzeImage = async () => {
    try {
      if (!selectedImage) {
        setError("Please select an image first.");
        return;
      }

      setLoadingImage(true);
      setError("");

      const base64Image = await convertBase64(selectedImage);

      const response = await fetch("http://localhost:5000/api/image/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Image analysis failed");

      setFoodAnalysis(data.result); // Backend ले पठाएको OpenAI को result
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Image analyze failed. Server error.");
    } finally {
      setLoadingImage(false);
    }
  };

  // =========================
  // UI / RENDER
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-cyan-400">AI Diet Planner</h1>
          <p className="text-slate-400 mt-4">Smart diet & calorie analysis</p>
        </div>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl mb-6 text-red-200 text-center font-semibold">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* DIET FORM (LEFT) */}
          <div className="bg-slate-900 p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6">Health Form</h2>
            <form onSubmit={generateDietPlan} className="space-y-4">
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input type="number" name="calorieGoal" placeholder="Daily Calorie Goal" value={formData.calorieGoal} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="muscle_building">Muscle Building</option>
              </select>

              <select name="dietType" value={formData.dietType} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non Vegetarian</option>
                <option value="pescatarian">Pescatarian</option>
              </select>

              <textarea name="allergies" placeholder="Allergies (comma separated, optional)" value={formData.allergies} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <textarea name="dislikedFoods" placeholder="Disliked Foods (comma separated, optional)" value={formData.dislikedFoods} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <textarea name="conditions" placeholder="Medical Conditions (comma separated, optional)" value={formData.conditions} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />

              <button type="submit" disabled={loadingDiet} className="w-full bg-cyan-500 hover:bg-cyan-600 transition-colors py-4 rounded-xl font-bold disabled:opacity-50">
                {loadingDiet ? "Generating..." : "Generate Diet"}
              </button>
            </form>
          </div>

          {/* IMAGE ANALYZER (RIGHT) */}
          <div className="bg-slate-900 p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6">Food Image Scanner</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mb-6 block w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500/10 file:text-emerald-500" />

            {imagePreview && (
              <img src={imagePreview} alt="preview" className="w-full h-72 object-cover rounded-2xl mb-6 shadow-lg border border-slate-700" />
            )}

            <button onClick={analyzeImage} disabled={loadingImage || !selectedImage} className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors py-4 rounded-xl font-bold disabled:opacity-50">
              {loadingImage ? "Analyzing..." : "Analyze Food"}
            </button>

            {foodAnalysis && (
              <div className="mt-6 bg-slate-800 p-5 rounded-2xl whitespace-pre-wrap leading-relaxed border border-slate-700 text-emerald-50">
                {foodAnalysis}
              </div>
            )}
          </div>
        </div>

        {/* DIET PLAN DISPLAY */}
        {dietPlan && dietPlan.plan && (
          <div className="mt-10 bg-slate-900 p-8 rounded-3xl">
            <h2 className="text-4xl font-bold mb-10 text-center text-white">{dietPlan.title}</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietPlan.plan.map((day, index) => (
                <div key={index} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-colors">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">Day {day.day}</h3>
                  
                  {day.meals && day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="mb-5 border-b border-slate-700/50 pb-4 last:border-0">
                      <h4 className="font-bold text-lg text-white">{meal.time}</h4>
                      <p className="text-slate-300 mt-1">{meal.foods.join(", ")}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-700">🔥 {meal.calories} kcal</span>
                        <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-700">🥩 {meal.protein}g</span>
                        <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-700">🌾 {meal.carbs}g</span>
                        <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-700">🥑 {meal.fats}g</span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-slate-700 bg-slate-900/50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-cyan-300">💧 Water: {day.waterIntake}</div>
                    <div className="text-sm font-medium text-emerald-300 mt-2">💡 Tip: {day.tips}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}