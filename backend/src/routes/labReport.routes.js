const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  createReport,
  getReports,
  deleteReport,
} = require("../controllers/labReport.controller");

const {
  protect,
} = require("../middleware/auth.middleware");


// PROTECT ALL ROUTES
router.use(protect);


router.get(
  "/",
  getReports
);

router.post(
  "/",
  upload.single("file"),
  createReport
);

router.delete(
  "/:id",
  deleteReport
);


module.exports = router;