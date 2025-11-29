const PaymentMethod = require('../models/PaymentMethod');

class PaymentService {
  // Get user's payment methods
  async getPaymentMethods(userId) {
    const paymentMethods = await PaymentMethod.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    return paymentMethods;
  }

  // Get single payment method
  async getPaymentMethodById(paymentMethodId, userId) {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user: userId });
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    
    return paymentMethod;
  }

  // Add payment method
  async addPaymentMethod(userId, paymentData) {
    const { cardType, lastFourDigits, cardholderName, expiryDate, billingAddress, isDefault } = paymentData;

    // Create payment method
    const paymentMethod = await PaymentMethod.create({
      user: userId,
      cardType,
      lastFourDigits,
      cardholderName,
      expiryDate,
      billingAddress,
      isDefault: isDefault || false
    });

    return paymentMethod;
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId, userId, updateData) {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user: userId });
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        paymentMethod[key] = updateData[key];
      }
    });

    await paymentMethod.save();
    return paymentMethod;
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId, userId) {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user: userId });
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    await paymentMethod.deleteOne();
    return { message: 'Payment method deleted successfully' };
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId, userId) {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user: userId });
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Remove default from all other payment methods
    await PaymentMethod.updateMany(
      { user: userId, _id: { $ne: paymentMethodId } },
      { isDefault: false }
    );

    // Set this as default
    paymentMethod.isDefault = true;
    await paymentMethod.save();

    return paymentMethod;
  }

  // Process payment (Demo - No actual payment gateway integration)
  async processPayment(userId, paymentMethodId, amount) {
    const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user: userId });
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Demo payment processing - always succeeds
    return {
      success: true,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
      amount,
      paymentMethod: {
        cardType: paymentMethod.cardType,
        lastFourDigits: paymentMethod.lastFourDigits
      },
      timestamp: new Date()
    };
  }
}

module.exports = new PaymentService();