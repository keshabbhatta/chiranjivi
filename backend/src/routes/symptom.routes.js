const express = require("express");
const symptomRouter = express.Router();
const { checkSymptoms } = require("../controllers/symptom.controller");

// Removed: const { protect } = require("../middleware/auth.middleware");
// Removed: symptomRouter.use(protect);

symptomRouter.post("/check", checkSymptoms);

module.exports = symptomRouter;