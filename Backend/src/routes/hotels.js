const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("./uploader");
const {
  getHotels,
  getHotel,
  searchHotels,
  checkAvailability,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

router.get("/", getHotels);
router.get("/search", searchHotels);
router.get("/check-availability", checkAvailability);
router.get("/:id", getHotel);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "hotelLogo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createHotel
);
router.put("/:id", protect, authorize("admin"), updateHotel);
router.delete("/:id", protect, authorize("admin"), deleteHotel);

module.exports = router;
