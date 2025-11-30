const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  
  // Flight booking details
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  flightDetails: {
    origin: {
      city: String,
      country: String
    },
    destination: {
      city: String,
      country: String
    },
    price: Number,
    image: String,
    description: String,
    passengers: {
      type: Number,
      min: 1,
      default: 1
    },
    travelClass: {
      type: String,
      enum: ['Economy', 'Business', 'First Class'],
      default: 'Economy'
    }
  },
  
  // Hotel booking details
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  hotelDetails: {
    hotelName: String,
    hotelLogo: String,
    checkInDate: Date,
    checkOutDate: Date,
    checkInTime: String,
    checkOutTime: String,
    roomNumber: String,
    roomType: String,
    numberOfGuests: Number,
    numberOfNights: Number,
    pricePerNight: Number
  },
  
  // Common booking fields
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  ticketUrl: {
    type: String,
    default: ''
  },
  confirmationUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const prefix = this.bookingType === 'flight' ? 'FLT' : 'HTL';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `${prefix}${random}${Date.now().toString().slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);