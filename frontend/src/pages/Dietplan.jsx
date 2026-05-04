import React, { useState } from 'react';

function Dietplan() {
  const [showDietPlan, setShowDietPlan] = useState(false);
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(false);
  const [showWeightGainPlan, setShowWeightGainPlan] = useState(false);

  const weeklyDietPlan = {
    Monday: {
      Breakfast: "Greek yogurt with honey, nuts, and berries",
      Snack: "Apple with almond butter",
      Lunch: "Quinoa salad with black beans, corn, tomatoes, and avocado",
      Dinner: "Grilled salmon with steamed broccoli and brown rice"
    },
    Tuesday: {
      Breakfast: "Whole grain toast with avocado and a poached egg",
      Snack: "A handful of mixed nuts",
      Lunch: "Lentil soup with a side salad",
      Dinner: "Stir-fried tofu with mixed vegetables and quinoa"
    },
    Wednesday: {
      Breakfast: "Smoothie with spinach, banana, berries, and protein powder",
      Snack: "Celery sticks with peanut butter",
      Lunch: "Chicken and vegetable wrap with whole grain tortilla",
      Dinner: "Baked cod with roasted Brussels sprouts and sweet potato"
    },
    Thursday: {
      Breakfast: "Oatmeal with chia seeds, almond milk, and fresh fruit",
      Snack: "A piece of fruit (e.g., orange or apple)",
      Lunch: "Turkey and vegetable sandwich on whole grain bread",
      Dinner: "Grilled chicken breast with quinoa and roasted vegetables"
    },
    Friday: {
      Breakfast: "Smoothie bowl with blended acai, banana, berries, and topped with granola",
      Snack: "A handful of mixed nuts and dried fruit",
      Lunch: "Spinach and feta stuffed chicken breast with a side of mixed greens",
      Dinner: "Shrimp stir-fry with brown rice and mixed vegetables"
    },
    Saturday: {
      Breakfast: "Whole grain pancakes with fresh fruit and a drizzle of maple syrup",
      Snack: "A small bowl of mixed berries",
      Lunch: "Tuna salad with mixed greens, tomatoes, and cucumbers",
      Dinner: "Beef and vegetable kebabs with a side of couscous"
    },
    Sunday: {
      Breakfast: "Scrambled eggs with spinach, tomatoes, and a slice of whole grain toast",
      Snack: "A smoothie with spinach, banana, berries, and protein powder",
      Lunch: "Quinoa and black bean salad with a lime vinaigrette",
      Dinner: "Baked salmon with a side of asparagus and sweet potato mash"
    }
  };

  const workoutPlan = {
    "Weekly Routine": {
      Monday: "Cardio + Full Body Strength Training",
      Tuesday: "HIIT (High-Intensity Interval Training) + Core Exercises",
      Wednesday: "Rest or Active Recovery (light activities like walking or yoga)",
      Thursday: "Cardio + Upper Body Strength Training",
      Friday: "HIIT + Lower Body Strength Training",
      Saturday: "Cardio + Full Body Strength Training",
      Sunday: "Rest or Active Recovery"
    },
    "Daily Workouts": {
      Monday: {
        Cardio: "30 minutes (running, cycling, or brisk walking)",
        "Strength Training": [
          "Squats: 3 sets of 12 reps",
          "Push-ups: 3 sets of 15 reps",
          "Bent-over rows: 3 sets of 12 reps",
          "Plank: 3 sets of 1 minute"
        ]
      },
      Tuesday: {
        HIIT: "20 minutes (alternating 1 minute of high-intensity exercise with 1 minute of rest)",
        "Core Exercises": [
          "Bicycle crunches: 3 sets of 20 reps",
          "Leg raises: 3 sets of 15 reps",
          "Russian twists: 3 sets of 20 reps",
          "Plank with shoulder taps: 3 sets of 15 reps per side"
        ]
      },
      Thursday: {
        Cardio: "30 minutes",
        "Upper Body Strength Training": [
          "Dumbbell shoulder press: 3 sets of 12 reps",
          "Tricep dips: 3 sets of 15 reps",
          "Bicep curls: 3 sets of 12 reps",
          "Lat pulldowns: 3 sets of 12 reps"
        ]
      },
      Friday: {
        HIIT: "20 minutes",
        "Lower Body Strength Training": [
          "Deadlifts: 3 sets of 12 reps",
          "Lunges: 3 sets of 15 reps per leg",
          "Calf raises: 3 sets of 20 reps",
          "Glute bridges: 3 sets of 15 reps"
        ]
      },
      Saturday: {
        Cardio: "30 minutes",
        "Full Body Strength Training": [
          "Goblet squats: 3 sets of 12 reps",
          "Push-ups: 3 sets of 15 reps",
          "Dumbbell rows: 3 sets of 12 reps per arm",
          "Bicycle crunches: 3 sets of 20 reps"
        ]
      }
    }
  };

  const weightGainWorkoutPlan = {
    Monday: {
      Warmup: "10 minutes of light cardio (jogging or cycling)",
      StrengthTraining: [
        { exercise: "Squats", sets: 4, reps: 8 },
        { exercise: "Bench Press", sets: 4, reps: 8 },
        { exercise: "Bent-over Rows", sets: 4, reps: 8 },
        { exercise: "Overhead Press", sets: 3, reps: 10 },
        { exercise: "Deadlifts", sets: 3, reps: 10 }
      ],
      CoolDown: "5 minutes of stretching"
    },
    Tuesday: {
      Warmup: "10 minutes of light cardio",
      StrengthTraining: [
        { exercise: "Pull-ups", sets: 4, reps: "Max reps" },
        { exercise: "Dumbbell Lunges", sets: 4, reps: 10 },
        { exercise: "Dips", sets: 4, reps: "Max reps" },
        { exercise: "Dumbbell Curls", sets: 3, reps: 12 },
        { exercise: "Calf Raises", sets: 3, reps: 15 }
      ],
      CoolDown: "5 minutes of stretching"
    },
    Wednesday: {
      RestDay: "Active Recovery (light activities like walking or yoga)"
    },
    Thursday: {
      Warmup: "10 minutes of light cardio",
      StrengthTraining: [
        { exercise: "Deadlifts", sets: 4, reps: 8 },
        { exercise: "Incline Bench Press", sets: 4, reps: 8 },
        { exercise: "Barbell Rows", sets: 4, reps: 8 },
        { exercise: "Lateral Raises", sets: 3, reps: 12 },
        { exercise: "Leg Press", sets: 3, reps: 10 }
      ],
      CoolDown: "5 minutes of stretching"
    },
    Friday: {
      Warmup: "10 minutes of light cardio",
      StrengthTraining: [
        { exercise: "Pull-ups", sets: 4, reps: "Max reps" },
        { exercise: "Front Squats", sets: 4, reps: 8 },
        { exercise: "Dips", sets: 4, reps: "Max reps" },
        { exercise: "Hammer Curls", sets: 3, reps: 12 },
        { exercise: "Seated Calf Raises", sets: 3, reps: 15 }
      ],
      CoolDown: "5 minutes of stretching"
    },
    Saturday: {
      Warmup: "10 minutes of light cardio",
      StrengthTraining: [
        { exercise: "Squats", sets: 4, reps: 8 },
        { exercise: "Flat Bench Press", sets: 4, reps: 8 },
        { exercise: "T-bar Rows", sets: 4, reps: 8 },
        { exercise: "Arnold Press", sets: 3, reps: 10 },
        { exercise: "Romanian Deadlifts", sets: 3, reps: 10 }
      ],
      CoolDown: "5 minutes of stretching"
    },
    Sunday: {
      RestDay: "Active Recovery (light activities like walking or yoga)"
    }
  };

  const backgroundImageUrl = 'https://th.bing.com/th/id/OIP.TuXX3ah2xc4x_j9_aBx5_AHaE8?rs=1&pid=ImgDetMain'; // Replace with your image URL

 
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Adjust the height as needed
        width: '100%', // Ensure the width is set
        color: 'pink', // Change text color to contrast the background
        padding: '40px', // Add some padding for better layout
        position: 'relative', // For overlay
        overflowY: 'auto' // Enable scrolling for long content
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust overlay transparency
          zIndex: 1
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Fat Loss Workout Plan</h1>
          <div className="text-center mb-6">
            <button
              onClick={() => setShowWorkoutPlan(!showWorkoutPlan)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {showWorkoutPlan ? "Hide Workout Plan" : "Show Workout Plan"}
            </button>
          </div>
          {showWorkoutPlan && (
            <div className="bg-gray-800 bg-opacity-70 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Weekly Routine:</h2>
              <ul className="list-disc list-inside mb-4">
                {Object.keys(workoutPlan["Weekly Routine"]).map(day => (
                  <li key={day} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{day}: {workoutPlan["Weekly Routine"][day]}</li>
                ))}
              </ul>
              <h2 className="text-xl font-semibold mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Daily Workouts:</h2>
              {Object.keys(workoutPlan["Daily Workouts"]).map(day => (
                <div key={day} className="mb-4">
                  <h3 className="text-lg font-medium mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{day}:</h3>
                  <ul className="list-disc list-inside">
                    {Object.keys(workoutPlan["Daily Workouts"][day]).map(section => (
                      <li key={section}>
                        <span className="font-semibold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{section}: </span>
                        {Array.isArray(workoutPlan["Daily Workouts"][day][section]) ? (
                          <ul className="list-disc list-inside ml-4">
                            {workoutPlan["Daily Workouts"][day][section].map((exercise, index) => (
                              <li key={index} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{exercise}</li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{workoutPlan["Daily Workouts"][day][section]}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Weekly Diet Plan</h1>
          <div className="text-center mb-6">
            <button
              onClick={() => setShowDietPlan(!showDietPlan)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {showDietPlan ? "Hide Diet Plan" : "Show Diet Plan"}
            </button>
          </div>
          {showDietPlan && (
            <div className="bg-gray-800 bg-opacity-70 p-4 rounded-md">
              {Object.keys(weeklyDietPlan).map(day => (
                <div key={day} className="mb-4">
                  <h2 className="text-xl font-semibold mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{day}:</h2>
                  <ul className="list-disc list-inside">
                    {Object.keys(weeklyDietPlan[day]).map(meal => (
                      <li key={meal}>
                        <span className="font-semibold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{meal}: </span>
                        {weeklyDietPlan[day][meal]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Weight Gain Workout Plan</h1>
          <div className="text-center mb-6">
            <button
              onClick={() => setShowWeightGainPlan(!showWeightGainPlan)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {showWeightGainPlan ? "Hide Workout Plan" : "Show Workout Plan"}
            </button>
          </div>
          {showWeightGainPlan && (
            <div className="bg-gray-800 bg-opacity-70 p-4 rounded-md">
              {Object.keys(weightGainWorkoutPlan).map(day => (
                <div key={day} className="mb-4">
                  <h2 className="text-xl font-semibold mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{day}:</h2>
                  {Object.keys(weightGainWorkoutPlan[day]).map(section => (
                    <div key={section}>
                      {section === "RestDay" ? (
                        <p><span className="font-semibold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{section}: </span>{weightGainWorkoutPlan[day][section]}</p>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{section}:</h3>
                          {Array.isArray(weightGainWorkoutPlan[day][section]) ? (
                            <ul className="list-disc list-inside ml-4">
                              {weightGainWorkoutPlan[day][section].map((exercise, index) => (
                                <li key={index}>
                                  <span className="font-semibold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{exercise.exercise}:</span>{" "}
                                  Sets: {exercise.sets}, Reps: {exercise.reps}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{weightGainWorkoutPlan[day][section]}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dietplan;
