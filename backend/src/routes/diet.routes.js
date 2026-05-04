const express = require("express");
const router  = express.Router();
const { generateDietPlan, getDietPlans, getDietPlanById, deleteDietPlan } = require("../controllers/diet.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get(    "/",           getDietPlans);
router.post(   "/generate",   generateDietPlan);
router.get(    "/:id",        getDietPlanById);
router.delete( "/:id",        deleteDietPlan);

module.exports = router;
