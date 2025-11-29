const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true
  },
  hotelLogo: {
    type: String,
    default: ''
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    }
  },
  description: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  roomTypes: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    maxGuests: {
      type: Number,
      required: true,
      min: [1, 'Max guests must be at least 1']
    },
    availableRooms: {
      type: Number,
      required: true,
      min: [0, 'Available rooms cannot be negative']
    },
    totalRooms: {
      type: Number,
      required: true,
      min: [1, 'Total rooms must be at least 1']
    },
    amenities: [{
      type: String
    }]
  }],
  checkInTime: {
    type: String,
    default: '2:00 PM'
  },
  checkOutTime: {
    type: String,
    default: '12:00 PM'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for searching hotels
hotelSchema.index({ 'location.city': 1, 'location.country': 1 });

module.exports = mongoose.model('Hotel', hotelSchema);