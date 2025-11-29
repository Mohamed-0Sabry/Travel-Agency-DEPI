const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardType: {
    type: String,
    enum: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
    required: [true, 'Please provide card type']
  },
  lastFourDigits: {
    type: String,
    required: [true, 'Please provide last four digits'],
    match: [/^\d{4}$/, 'Last four digits must be exactly 4 numbers']
  },
  cardholderName: {
    type: String,
    required: [true, 'Please provide cardholder name'],
    trim: true
  },
  expiryDate: {
    type: String,
    required: [true, 'Please provide expiry date'],
    match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  billingAddress: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    }
  }
}, {
  timestamps: true
});

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);