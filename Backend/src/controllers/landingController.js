const landingData = require("../data/landingPageData.json");

exports.getLandingPageData = (req, res) => {
  res.json(landingData);
};
