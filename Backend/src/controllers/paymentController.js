const paymentService = require('../services/paymentService');

// Get payment methods
exports.getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await paymentService.getPaymentMethods(req.user.id);
    res.status(200).json({
      success: true,
      count: paymentMethods.length,
      data: paymentMethods
    });
  } catch (error) {
    next(error);
  }
};

// Get one payment method
exports.getPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await paymentService.getPaymentMethodById(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// Add payment method
exports.addPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await paymentService.addPaymentMethod(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// Update payment method
exports.updatePaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await paymentService.updatePaymentMethod(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// Delete payment method
exports.deletePaymentMethod = async (req, res, next) => {
  try {
    const result = await paymentService.deletePaymentMethod(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Set default payment method
exports.setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await paymentService.setDefaultPaymentMethod(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// Process payment
exports.processPayment = async (req, res, next) => {
  try {
    const { paymentMethodId, amount } = req.body;
    const result = await paymentService.processPayment(req.user.id, paymentMethodId, amount);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};