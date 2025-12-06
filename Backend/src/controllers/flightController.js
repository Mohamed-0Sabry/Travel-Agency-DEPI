const flightService = require('../services/flightService');

// Get all flights
exports.getFlights = async (req, res, next) => {
  try {
    const flights = await flightService.getAllFlights(req.query);
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Get single flight
exports.getFlight = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);
    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

// Search flights
exports.searchFlights = async (req, res, next) => {
  try {
    const flights = await flightService.searchFlights(req.query);
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Get flights with offers
exports.getFlightsWithOffers = async (req, res, next) => {
  try {
    const flights = await flightService.getFlightsWithOffers();
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Get popular flights
exports.getPopularFlights = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const flights = await flightService.getPopularFlights(limit);
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Get flights by destination
exports.getFlightsByDestination = async (req, res, next) => {
  try {
    const { city, country } = req.query;
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }
    const flights = await flightService.getFlightsByDestination(city, country);
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Get flights by origin
exports.getFlightsByOrigin = async (req, res, next) => {
  try {
    const { city, country } = req.query;
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }
    const flights = await flightService.getFlightsByOrigin(city, country);
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

// Create flight (Admin)
exports.createFlight = async (req, res, next) => {
  try {
    const flight = await flightService.createFlight(req.body);
    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    next(error);
  }
};

// Update flight (Admin)
exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await flightService.updateFlight(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    next(error);
  }
};

// Delete flight (Admin)
exports.deleteFlight = async (req, res, next) => {
  try {
    const result = await flightService.deleteFlight(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update flight rating (Admin)
exports.updateFlightRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    if (rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }
    const flight = await flightService.updateFlightRating(req.params.id, rating);
    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

// Toggle offer (Admin)
exports.toggleOffer = async (req, res, next) => {
  try {
    const flight = await flightService.toggleOffer(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};