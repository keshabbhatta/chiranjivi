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
    <div className="min-h-screen bg-black text-white p-6 font-sans selection:bg-fuchsia-500 selection:text-black">
      {/* Injecting CSS Keyframes dynamically for the revolving light trail */}
      <style>{`
        @keyframes borderRotate {
          100% { transform: rotate(360deg); }
        }
        .revolving-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 2rem;
          background: conic-gradient(from 0deg, transparent 40%, var(--border-glow-color, #f55) 50%, transparent 60%);
          animation: borderRotate 4s linear infinite;
          z-index: 0;
          pointer-events: none;
        }
        .revolving-border::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: #0a0a0a;
          border-radius: calc(2rem - 1px);
          z-index: 0;
          pointer-events: none;
        }
        .revolving-inner-content {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12 mt-6">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 animate-pulse tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            Chiranji Diet Planner
          </h1>
          <p className="text-gray-400 mt-4 text-xl tracking-widest font-light">
            SMART DIET & CALORIE ANALYSIS
          </p>
        </div>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="bg-red-950/40 border border-red-500 p-4 rounded-xl mb-8 text-red-400 text-center font-bold tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-bounce">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* DIET FORM (LEFT) */}
          <div 
            className="revolving-border relative overflow-hidden bg-[#0a0a0a] p-8 rounded-[2rem] shadow-[0_0_30px_rgba(217,70,239,0.05)] transition-all duration-500 group"
            style={{ '--border-glow-color': '#d946ef' }}
          >
            <div className="revolving-inner-content">
              <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                Health Form
              </h2>
              <form onSubmit={generateDietPlan} className="space-y-5">
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300" required />
                <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300" required />
                <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300" required />
                <input type="number" name="calorieGoal" placeholder="Daily Calorie Goal" value={formData.calorieGoal} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300" required />
                
                <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-gray-300 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 appearance-none">
                  <option value="maintenance">Maintenance</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="weight_gain">Weight Gain</option>
                  <option value="muscle_building">Muscle Building</option>
                </select>

                <select name="dietType" value={formData.dietType} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-gray-300 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 appearance-none">
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="non-vegetarian">Non Vegetarian</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>

                <textarea name="allergies" placeholder="Allergies (comma separated, optional)" value={formData.allergies} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 min-h-[100px]" />
                <textarea name="dislikedFoods" placeholder="Disliked Foods (comma separated, optional)" value={formData.dislikedFoods} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 min-h-[100px]" />
                <textarea name="conditions" placeholder="Medical Conditions (comma separated, optional)" value={formData.conditions} onChange={handleChange} className="w-full p-4 rounded-xl bg-black border border-gray-800 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 min-h-[100px]" />

                <button type="submit" disabled={loadingDiet} className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 transition-all duration-300 py-4 rounded-xl font-black text-lg tracking-wider disabled:opacity-50 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(217,70,239,0.3)]">
                  {loadingDiet ? "GENERATING ✨..." : "GENERATE DIET PLAN 🚀"}
                </button>
              </form>
            </div>
          </div>

          {/* IMAGE ANALYZER (RIGHT) */}
          <div 
            className="revolving-border relative overflow-hidden bg-[#0a0a0a] p-8 rounded-[2rem] shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-500 group h-fit"
            style={{ '--border-glow-color': '#10b981' }}
          >
            <div className="revolving-inner-content">
              <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Food Image Scanner
              </h2>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mb-6 block w-full text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-emerald-500/10 file:text-emerald-400 file:font-bold hover:file:bg-emerald-500/20 file:transition-all cursor-pointer" />

              {imagePreview && (
                <div className="relative group/img mb-6">
                   <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover/img:opacity-50 transition duration-500"></div>
                   <img src={imagePreview} alt="preview" className="relative w-full h-80 object-cover rounded-2xl shadow-2xl border border-gray-800" />
                </div>
              )}

              <button onClick={analyzeImage} disabled={loadingImage || !selectedImage} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 py-4 rounded-xl font-black text-lg tracking-wider disabled:opacity-50 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
                {loadingImage ? "ANALYZING 🔍..." : "ANALYZE FOOD 📸"}
              </button>

              {foodAnalysis && (
                <div className="mt-8 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-black p-6 rounded-2xl whitespace-pre-wrap leading-relaxed border border-gray-800 text-emerald-100 font-medium">
                    {foodAnalysis}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DIET PLAN DISPLAY */}
        {dietPlan && dietPlan.plan && (
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-cyan-500/5 rounded-[3rem] blur-xl pointer-events-none"></div>
            <div className="relative bg-[#0a0a0a] border border-gray-800 p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-5xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-fuchsia-500 to-cyan-500">
                {dietPlan.title}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dietPlan.plan.map((day, index) => (
                  <div key={index} className="bg-black border border-gray-800 p-8 rounded-[2rem] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:-translate-y-2 group">
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 group-hover:animate-pulse">
                      Day {day.day}
                    </h3>
                    
                    {day.meals && day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="mb-6 border-b border-gray-800/80 pb-5 last:border-0 relative">
                        <h4 className="font-bold text-xl text-fuchsia-400 mb-2">{meal.time}</h4>
                        <p className="text-gray-300 font-medium">{meal.foods.join(", ")}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-xs font-bold bg-gray-900 px-3 py-1.5 rounded-lg text-orange-400 border border-orange-900/30">🔥 {meal.calories} kcal</span>
                          <span className="text-xs font-bold bg-gray-900 px-3 py-1.5 rounded-lg text-rose-400 border border-rose-900/30">🥩 {meal.protein}g</span>
                          <span className="text-xs font-bold bg-gray-900 px-3 py-1.5 rounded-lg text-yellow-400 border border-yellow-900/30">🌾 {meal.carbs}g</span>
                          <span className="text-xs font-bold bg-gray-900 px-3 py-1.5 rounded-lg text-emerald-400 border border-emerald-900/30">🥑 {meal.fats}g</span>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 pt-6 border-t border-gray-800 bg-gray-900/40 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500"></div>
                      <div className="text-sm font-bold text-cyan-300 tracking-wide">💧 Water: <span className="text-white">{day.waterIntake}</span></div>
                      <div className="text-sm font-bold text-emerald-400 mt-3 tracking-wide leading-relaxed">💡 Tip: <span className="text-emerald-100 font-medium">{day.tips}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}