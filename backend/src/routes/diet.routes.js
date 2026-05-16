const express = require("express");
const router = express.Router();

// Controller बाट सबै फङ्सनहरू तान्ने
const { 
  generateDietPlan, 
  getDietPlans, 
  getDietPlanById, 
  deleteDietPlan 
} = require("../controllers/diet.controller");

// परीक्षणको लागि अहिले protect middleware लाई कमेन्ट (comment) गरिएको छ।
// Frontend बाट token पठाउन थालेपछि मात्र यी दुई लाइनको अगाडिको // हटाउनुहोला।
// const { protect } = require("../middleware/auth.middleware");
// router.use(protect);

router.get("/", getDietPlans);
router.post("/generate", generateDietPlan);
router.get("/:id", getDietPlanById);
router.delete("/:id", deleteDietPlan);

module.exports = router;