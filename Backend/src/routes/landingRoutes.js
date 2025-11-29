const express = require("express");
const router = express.Router();

const { getLandingPageData } = require("../controllers/landingController");

router.get("/", getLandingPageData);

module.exports = router;
