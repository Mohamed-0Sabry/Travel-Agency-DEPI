const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [50, 'Price must be at least 50'],
    max: [10000, 'Price must be at most 10000']
  },

  origin: {
    city: { 
      type: String, 
      required: [true, 'Origin city is required'],
      trim: true
    },
    country: { 
      type: String, 
      required: [true, 'Origin country is required'],
      trim: true
    }
  },

  destination: {
    city: { 
      type: String, 
      required: [true, 'Destination city is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Destination country is required'],
      trim: true
    }
  },

  offer: {
    isActive: { 
      type: Boolean, 
      default: false 
    },
    oldPrice: { 
      type: Number, 
      min: [0, 'Old price cannot be negative'] 
    },
    newPrice: {
      type: Number,
      min: [0, 'New price cannot be negative'],
      validate: {
        validator: function (value) {
          return !this.offer.isActive || value < this.offer.oldPrice;
        },
        message: 'New price must be lower than old price when offer is active'
      }
    },
    badge: { 
      type: String, 
      default: 'Hot Offer' 
    },
    expiresAt: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > new Date();
        },
        message: 'Expiration date must be in the future'
      }
    }
  },

  image: {
    type: String,
    required: [true, 'Flight image is required']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  }
}, {
  timestamps: true
});

// Index for searching flights
flightSchema.index({ 'origin.city': 1, 'destination.city': 1 });
flightSchema.index({ 'origin.country': 1, 'destination.country': 1 });

module.exports = mongoose.model('Flight', flightSchema);