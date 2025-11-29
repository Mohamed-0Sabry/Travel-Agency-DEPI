const hotelService = require('../services/hotelService');

// Get all hotels
exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAllHotels(req.query);
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// Get single hotel
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// Search hotels
exports.searchHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.searchHotels(req.query);
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// Check hotel availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const { hotelId, roomType, numberOfRooms } = req.query;
    const availability = await hotelService.checkAvailability(hotelId, roomType, parseInt(numberOfRooms));
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Create hotel (Admin)
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// Update hotel (Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// Delete hotel (Admin)
exports.deleteHotel = async (req, res, next) => {
  try {
    const result = await hotelService.deleteHotel(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};