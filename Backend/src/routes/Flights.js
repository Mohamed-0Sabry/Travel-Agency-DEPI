const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFlights,
  getFlight,
  searchFlights,
  getFlightsWithOffers,
  getPopularFlights,
  getFlightsByDestination,
  getFlightsByOrigin,
  createFlight,
  updateFlight,
  deleteFlight,
  updateFlightRating,
  toggleOffer
} = require('../controllers/flightController');

router.get('/', getFlights);
router.get('/search', searchFlights);
router.get('/offers', getFlightsWithOffers);
router.get('/popular', getPopularFlights);
router.get('/by-destination', getFlightsByDestination);
router.get('/by-origin', getFlightsByOrigin);
router.get('/:id', getFlight);

// Admin routes
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);
router.put('/:id/rating', protect, authorize('admin'), updateFlightRating);
router.put('/:id/offer', protect, authorize('admin'), toggleOffer);

module.exports = router;