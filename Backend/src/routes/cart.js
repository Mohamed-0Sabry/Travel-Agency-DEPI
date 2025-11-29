const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addFlightToCart,
  addHotelToCart,
  removeFromCart,
  clearCart,
  updateCartItem
} = require('../controllers/cartController');

router.use(protect);

router.get('/', getCart);
router.post('/flight', addFlightToCart);
router.post('/hotel', addHotelToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;