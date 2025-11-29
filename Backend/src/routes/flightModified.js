const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFlights,
  getFlight,
  searchFlights,
  checkAvailability,
  createFlight,
  updateFlight,
  deleteFlight
} = require('../controllers/flightController');

router.get('/', getFlights);
router.get('/search', searchFlights);
router.get('/check-availability', checkAvailability);
router.get('/:id', getFlight);

// Admin routes
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

module.exports = router;