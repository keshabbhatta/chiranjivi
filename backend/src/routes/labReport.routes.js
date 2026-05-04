const express = require("express");
const router  = express.Router();
const { createReport, getReports, getReportById, analyzeReport, deleteReport } = require("../controllers/labReport.controller");
const { protect }  = require("../middleware/auth.middleware");
const { upload }   = require("../middleware/upload.middleware");

router.use(protect);
router.get( "/",              getReports);
router.post("/",              upload.single("file"), createReport);
router.get( "/:id",           getReportById);
router.post("/:id/analyze",   analyzeReport);
router.delete("/:id",         deleteReport);

module.exports = router;
