const Flight = require('../models/Flights');
const { handleFlightValidation } = require('../utils/flightValidation');

class FlightService {
  // Get all flights with filters
  async getAllFlights(filters = {}) {
    const query = {};
    
    if (filters.originCity) {
      query['origin.city'] = new RegExp(filters.originCity, 'i');
    }
    if (filters.originCountry) {
      query['origin.country'] = new RegExp(filters.originCountry, 'i');
    }
    if (filters.destinationCity) {
      query['destination.city'] = new RegExp(filters.destinationCity, 'i');
    }
    if (filters.destinationCountry) {
      query['destination.country'] = new RegExp(filters.destinationCountry, 'i');
    }
    if (filters.minPrice) {
      query.price = { ...query.price, $gte: parseFloat(filters.minPrice) };
    }
    if (filters.maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(filters.maxPrice) };
    }
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    if (filters.hasOffer === 'true') {
      query['offer.isActive'] = true;
    }

    const flights = await Flight.find(query).sort({ createdAt: -1 });
    return flights;
  }

  // Get single flight by ID
  async getFlightById(id) {
    const flight = await Flight.findById(id);
    if (!flight) {
      throw new Error('Flight not found');
    }
    return flight;
  }

  // Create new flight (Admin)
  async createFlight(flightData) {
    // Validate flight data
    const validation = handleFlightValidation(flightData);
    
    if (!validation.valid) {
      const error = new Error('Validation failed');
      error.errors = validation.errors;
      throw error;
    }

    const flight = await Flight.create(validation.value);
    return flight;
  }

  // Update flight (Admin)
  async updateFlight(id, updateData) {
    // If updating, validate the data
    if (Object.keys(updateData).length > 0) {
      const validation = handleFlightValidation(updateData);
      
      if (!validation.valid) {
        const error = new Error('Validation failed');
        error.errors = validation.errors;
        throw error;
      }
    }

    const flight = await Flight.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!flight) {
      throw new Error('Flight not found');
    }

    return flight;
  }

  // Delete flight (Admin)
  async deleteFlight(id) {
    const flight = await Flight.findByIdAndDelete(id);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    return { message: 'Flight deleted successfully' };
  }

  // Search flights
  async searchFlights(searchParams) {
    const { from, to, minPrice, maxPrice, hasOffer } = searchParams;
    
    const query = {};

    if (from) {
      query.$or = [
        { 'origin.city': new RegExp(from, 'i') },
        { 'origin.country': new RegExp(from, 'i') }
      ];
    }

    if (to) {
      const destQuery = {
        $or: [
          { 'destination.city': new RegExp(to, 'i') },
          { 'destination.country': new RegExp(to, 'i') }
        ]
      };
      
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          destQuery
        ];
        delete query.$or;
      } else {
        query.$or = destQuery.$or;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (hasOffer === 'true') {
      query['offer.isActive'] = true;
    }

    const flights = await Flight.find(query).sort({ rating: -1, price: 1 });
    return flights;
  }

  // Get flights with active offers
  async getFlightsWithOffers() {
    const flights = await Flight.find({
      'offer.isActive': true,
      $or: [
        { 'offer.expiresAt': { $exists: false } },
        { 'offer.expiresAt': { $gte: new Date() } }
      ]
    }).sort({ 'offer.newPrice': 1 });

    return flights;
  }

  // Get popular flights (by rating)
  async getPopularFlights(limit = 10) {
    const flights = await Flight.find()
      .sort({ rating: -1 })
      .limit(limit);
    
    return flights;
  }

  // Get flights by destination
  async getFlightsByDestination(city, country) {
    const query = {
      'destination.city': new RegExp(city, 'i')
    };

    if (country) {
      query['destination.country'] = new RegExp(country, 'i');
    }

    const flights = await Flight.find(query).sort({ price: 1 });
    return flights;
  }

  // Get flights by origin
  async getFlightsByOrigin(city, country) {
    const query = {
      'origin.city': new RegExp(city, 'i')
    };

    if (country) {
      query['origin.country'] = new RegExp(country, 'i');
    }

    const flights = await Flight.find(query).sort({ price: 1 });
    return flights;
  }

  // Update flight rating
  async updateFlightRating(id, rating) {
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    const flight = await Flight.findByIdAndUpdate(
      id,
      { rating },
      { new: true, runValidators: true }
    );

    if (!flight) {
      throw new Error('Flight not found');
    }

    return flight;
  }

  // Activate/Deactivate offer
  async toggleOffer(id, offerData) {
    const flight = await Flight.findById(id);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    if (offerData.isActive) {
      // Activating offer - validate prices
      if (!offerData.oldPrice || !offerData.newPrice) {
        throw new Error('Old price and new price are required for active offers');
      }
      if (offerData.newPrice >= offerData.oldPrice) {
        throw new Error('New price must be lower than old price');
      }
    }

    flight.offer = {
      ...flight.offer,
      ...offerData
    };

    await flight.save();
    return flight;
  }
}

module.exports = new FlightService();