const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPaymentMethods,
  getPaymentMethod,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  processPayment
} = require('../controllers/paymentController');

router.use(protect);

router.get('/', getPaymentMethods);
router.get('/:id', getPaymentMethod);
router.post('/', addPaymentMethod);
router.put('/:id', updatePaymentMethod);
router.put('/:id/set-default', setDefaultPaymentMethod);
router.delete('/:id', deletePaymentMethod);
router.post('/process', processPayment);

module.exports = router;