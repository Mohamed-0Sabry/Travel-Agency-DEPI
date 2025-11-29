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

// Check flight availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const { flightId, flightClass, numberOfSeats } = req.query;
    const availability = await flightService.checkAvailability(flightId, flightClass, parseInt(numberOfSeats));
    res.status(200).json({
      success: true,
      data: availability
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