const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  
  // Flight item
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  flightClass: {
    type: String,
    enum: ['Economy', 'Business', 'First Class']
  },
  passengers: {
    type: Number,
    min: [1, 'At least 1 passenger required']
  },
  
  // Hotel item
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
  
  // Common fields
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

// Calculate total price before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);