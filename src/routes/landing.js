const express = require("express");
const router = express.Router();

const landingData = require("../landingPageData.json");

router.get("/", (req, res) => {
  res.status(200).json(landingData);
});

module.exports = router;
