const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Please provide flight number'],
    unique: true,
    trim: true
  },
  airline: {
    type: String,
    required: [true, 'Please provide airline name'],
    trim: true
  },
  airlineLogo: {
    type: String,
    default: ''
  },
  departureAirport: {
    type: String,
    required: [true, 'Please provide departure airport'],
    trim: true
  },
  arrivalAirport: {
    type: String,
    required: [true, 'Please provide arrival airport'],
    trim: true
  },
  departureTime: {
    type: String,
    required: [true, 'Please provide departure time']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please provide arrival time']
  },
  date: {
    type: Date,
    required: [true, 'Please provide flight date']
  },
  flightDuration: {
    type: String,
    required: [true, 'Please provide flight duration']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please provide available seats'],
    min: [0, 'Available seats cannot be negative']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: [1, 'Total seats must be at least 1']
  },
  classes: [{
    name: {
      type: String,
      enum: ['Economy', 'Business', 'First Class'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative']
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  gate: {
    type: String,
    default: 'TBA'
  },
  offer: {
    isActive: { type: Boolean, default: false },
    oldPrice: { type: Number, min: [0, "Old price cannot be negative"] },
    newPrice: {
      type: Number,
      min: [0, "New price cannot be negative"],
      validate: {
        validator: function (value) {
          return !this.offer.isActive || value < this.offer.oldPrice;
        },
        message:
          "New price must be lower than old price when offer is active",
      },
    },
    badge: { type: String, default: "Hot Offer" },
    expiresAt: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > new Date();
        },
        message: "Expiration date must be in the future",
      },
    },
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  rating: {
    type: Number,
    min: [0, "Rating cannot be negative"],
    max: [5, "Rating cannot be more than 5"],
    default: 0,
  },
}, {
  timestamps: true
});

// Index for searching flights
flightSchema.index({ departureAirport: 1, arrivalAirport: 1, date: 1 });

module.exports = mongoose.model('Flight', flightSchema);