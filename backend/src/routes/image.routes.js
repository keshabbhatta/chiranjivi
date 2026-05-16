const express = require("express");
const router = express.Router();

const {
  analyzeFoodImage,
} = require("../controllers/image.controller");

router.post("/analyze", analyzeFoodImage);

module.exports = router;