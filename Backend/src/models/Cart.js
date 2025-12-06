const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },

  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  passengers: {
    type: Number,
    min: [1, 'At least 1 passenger required']
  },
  travelClass: {
    type: String,
    enum: ['Economy', 'Business', 'First Class'],
    default: 'Economy'
  },

  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  roomType: {
    type: String
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  numberOfGuests: {
    type: Number,
    min: [1, 'At least 1 guest required']
  },
  numberOfNights: {
    type: Number,
    min: [1, 'At least 1 night required']
  },

  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Total price cannot be negative']
  }
}, {
  timestamps: true
});

cartSchema.pre('save', async function () {
  try {
    if (!Array.isArray(this.items) || this.items.length === 0) {
      this.totalPrice = 0;
      return;
    }

    this.totalPrice = this.items.reduce((total, item) => {
      const p = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
      return total + p;
    }, 0);
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model('Cart', cartSchema);