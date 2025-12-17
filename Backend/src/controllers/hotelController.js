const hotelService = require("../services/hotelService");

// Get all hotels
exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAllHotels(req.query);
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
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
      data: hotel,
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
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// Check hotel
exports.checkAvailability = async (req, res, next) => {
  try {
    const { hotelId, roomType, numberOfRooms } = req.query;
    const availability = await hotelService.checkAvailability(
      hotelId,
      roomType,
      parseInt(numberOfRooms)
    );
    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// Create hotel (Admin)
exports.createHotel = async (req, res, next) => {
  try {
    console.log("Hotel req.body:", req.body);
    console.log("Hotel req.files:", req.files);
    const hotel = await hotelService.createHotel(req.body, req.files);
    res.status(201).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    next(error);
  }
};

// Update hotel (Admin)
// Update hotel (Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    console.log('=== UPDATE HOTEL REQUEST ===');
    console.log('Hotel ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const updateData = {};

    // Handle text fields
    if (req.body.hotelName) updateData.hotelName = req.body.hotelName;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.rating) updateData.rating = parseFloat(req.body.rating);
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.checkInTime) updateData.checkInTime = req.body.checkInTime;
    if (req.body.checkOutTime) updateData.checkOutTime = req.body.checkOutTime;

    // Handle location - construct the location object
    if (req.body.city || req.body.country || req.body.address) {
      updateData.location = {};
      if (req.body.city) updateData.location.city = req.body.city;
      if (req.body.country) updateData.location.country = req.body.country;
      if (req.body.address) updateData.location.address = req.body.address;
    }

    // Handle amenities
    if (req.body.amenities) {
      try {
        updateData.amenities = JSON.parse(req.body.amenities);
      } catch (e) {
        // If not JSON, split by comma
        updateData.amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    // Handle room types
    if (req.body.roomTypes) {
      try {
        const parsedRoomTypes = JSON.parse(req.body.roomTypes);
        console.log('Parsed room types:', parsedRoomTypes);
        updateData.roomTypes = parsedRoomTypes;
      } catch (e) {
        console.error('Error parsing roomTypes:', e);
      }
    }

    // Handle file uploads
    if (req.files) {
      console.log('Files received:', req.files);
      
      // Handle hotel logo
      if (req.files.hotelLogo && req.files.hotelLogo[0]) {
        updateData.hotelLogo = req.files.hotelLogo[0].filename;
        console.log('New logo uploaded:', updateData.hotelLogo);
      }
      
      // Handle hotel images
      if (req.files.images && req.files.images.length > 0) {
        updateData.images = req.files.images.map(file => file.filename);
        console.log('New images uploaded:', updateData.images);
      }
    } else if (req.body.hotelLogo) {
      // If no new file but hotelLogo field exists, keep the existing logo
      updateData.hotelLogo = req.body.hotelLogo;
      console.log('Keeping existing logo:', updateData.hotelLogo);
    }

    console.log('Final update data:', JSON.stringify(updateData, null, 2));

    // Perform the update
    const hotel = await hotelService.updateHotel(req.params.id, updateData);
    
    console.log('Hotel updated successfully:', hotel._id);
    console.log('=== END UPDATE HOTEL ===');
    
    res.status(200).json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('=== UPDATE HOTEL ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===');
    next(error);
  }
};

// Delete hotel (Admin)
exports.deleteHotel = async (req, res, next) => {
  try {
    const result = await hotelService.deleteHotel(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
