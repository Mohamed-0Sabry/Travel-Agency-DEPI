const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createFlightBooking,
  createHotelBooking,
  checkoutCart,
  getMyBookings,
  getBooking,
  getAllBookings,
  cancelBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.use(protect);

router.post('/flight', createFlightBooking);
router.post('/hotel', createHotelBooking);
router.post('/checkout', checkoutCart);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin routes
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('admin'), updateBookingStatus);

module.exports = router;