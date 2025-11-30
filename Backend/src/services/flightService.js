const Flight = require('../models/FlightsModified');

class FlightService {
  // Get all flights with filters
  async getAllFlights(filters = {}) {
    const query = {};
    
    if (filters.departureAirport) {
      query.departureAirport = new RegExp(filters.departureAirport, 'i');
    }
    if (filters.arrivalAirport) {
      query.arrivalAirport = new RegExp(filters.arrivalAirport, 'i');
    }
    if (filters.date) {
      const startDate = new Date(filters.date);
      const endDate = new Date(filters.date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (filters.airline) {
      query.airline = new RegExp(filters.airline, 'i');
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const flights = await Flight.find(query).sort({ date: 1, departureTime: 1 });
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

  // Get Flights with Offers
  async getFlightsWithOffers(){
    const flights = await Flight.find({ "offer.isActive": true });
    return flights;
  }

  // Create new flight (Admin)
  async createFlight(flightData) {
    const flight = await Flight.create(flightData);
    return flight;
  }

  // Update flight (Admin)
  async updateFlight(id, updateData) {
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
    const { from, to, date, passengers, flightClass } = searchParams;
    
    const query = {
      departureAirport: new RegExp(from, 'i'),
      arrivalAirport: new RegExp(to, 'i'),
      status: { $in: ['scheduled', 'boarding'] }
    };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    let flights = await Flight.find(query).sort({ date: 1, departureTime: 1 });

    // Filter by class availability if specified
    if (flightClass && passengers) {
      flights = flights.filter(flight => {
        const classInfo = flight.classes.find(c => c.name === flightClass);
        return classInfo && classInfo.availableSeats >= passengers;
      });
    }

    return flights;
  }

  // Check seat availability
  async checkAvailability(flightId, flightClass, numberOfSeats) {
    const flight = await Flight.findById(flightId);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    const classInfo = flight.classes.find(c => c.name === flightClass);
    
    if (!classInfo) {
      throw new Error('Flight class not found');
    }

    if (classInfo.availableSeats < numberOfSeats) {
      throw new Error('Not enough seats available');
    }

    return {
      available: true,
      availableSeats: classInfo.availableSeats,
      price: classInfo.price
    };
  }

  // Update seat availability (used during booking)
  async updateSeatAvailability(flightId, flightClass, numberOfSeats, operation = 'decrease') {
    const flight = await Flight.findById(flightId);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    const classInfo = flight.classes.find(c => c.name === flightClass);
    
    if (!classInfo) {
      throw new Error('Flight class not found');
    }

    if (operation === 'decrease') {
      if (classInfo.availableSeats < numberOfSeats) {
        throw new Error('Not enough seats available');
      }
      classInfo.availableSeats -= numberOfSeats;
    } else {
      classInfo.availableSeats += numberOfSeats;
    }

    await flight.save();
    return flight;
  }
}

module.exports = new FlightService();