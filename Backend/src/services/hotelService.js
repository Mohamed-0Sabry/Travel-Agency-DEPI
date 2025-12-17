const Hotel = require("../models/Hotel");

class HotelService {
  // Get all hotels with filters
  async getAllHotels(filters = {}) {
    const query = { status: "active" };

    if (filters.city) {
      query["location.city"] = new RegExp(filters.city, "i");
    }
    if (filters.country) {
      query["location.country"] = new RegExp(filters.country, "i");
    }
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    if (filters.hotelName) {
      query.hotelName = new RegExp(filters.hotelName, "i");
    }

    const hotels = await Hotel.find(query).sort({ rating: -1 });
    return hotels;
  }

  // Get single hotel by ID
  async getHotelById(id) {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    return hotel;
  }

  // Create new hotel (Admin)
  async createHotel(hotelData, files) {
    // Helper function to convert flat dot notation to nested objects/arrays
    const flatToNested = (obj) => {
      const result = {};
      for (const key in obj) {
        const keys = key.split(".");
        let current = result;
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          const nextK = keys[i + 1];
          const isNextNumeric = /^\d+$/.test(nextK);

          if (!current[k]) {
            current[k] = isNextNumeric ? [] : {};
          }
          current = current[k];
        }
        const lastKey = keys[keys.length - 1];
        if (Array.isArray(current)) {
          // For arrays, convert index to number
          const index = parseInt(lastKey);
          current[index] = obj[key];
        } else {
          current[lastKey] = obj[key];
        }
      }
      return result;
    };

    // Convert flat keys to nested structure
    const hotelPayload = flatToNested(hotelData);

    // Convert string values to proper types
    if (typeof hotelPayload.rating === "string") {
      hotelPayload.rating = parseFloat(hotelPayload.rating);
    }

    // Parse amenities if it's a string
    if (hotelPayload.amenities && typeof hotelPayload.amenities === "string") {
      hotelPayload.amenities = hotelPayload.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }

    // Convert roomTypes string values to proper types
    if (hotelPayload.roomTypes && Array.isArray(hotelPayload.roomTypes)) {
      hotelPayload.roomTypes = hotelPayload.roomTypes.filter(
        (rt) => rt && rt.name
      ); // Filter out empty room types
      hotelPayload.roomTypes.forEach((rt) => {
        if (typeof rt.pricePerNight === "string") {
          rt.pricePerNight = parseFloat(rt.pricePerNight);
        }
        if (typeof rt.maxGuests === "string") {
          rt.maxGuests = parseInt(rt.maxGuests);
        }
        if (typeof rt.availableRooms === "string") {
          rt.availableRooms = parseInt(rt.availableRooms);
        }
        if (typeof rt.totalRooms === "string") {
          rt.totalRooms = parseInt(rt.totalRooms);
        }
      });
    }

    // Add logo filename from multer file
    if (files && files.hotelLogo && files.hotelLogo[0]) {
      hotelPayload.hotelLogo = files.hotelLogo[0].filename;
    }

    // Add images filenames from multer files
    if (files && files.images && files.images.length > 0) {
      hotelPayload.images = files.images.map((file) => file.filename);
    }

    const hotel = await Hotel.create(hotelPayload);
    return hotel;
  }

  // Update hotel (Admin)
  // Update hotel (Admin)
  async updateHotel(id, updateData) {
    console.log('Service: Updating hotel with ID:', id);
    console.log('Service: Update data received:', JSON.stringify(updateData, null, 2));

    // Find the hotel first to verify it exists
    const existingHotel = await Hotel.findById(id);
    if (!existingHotel) {
      throw new Error("Hotel not found");
    }

    console.log('Service: Existing hotel found:', existingHotel.hotelName);

    // Perform the update
    const hotel = await Hotel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,           // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!hotel) {
      throw new Error("Hotel not found after update");
    }

    console.log('Service: Hotel updated successfully');
    return hotel;
  }

  // Delete hotel (Admin)
  async deleteHotel(id) {
    const hotel = await Hotel.findByIdAndDelete(id);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    return { message: "Hotel deleted successfully" };
  }

  // Search hotels
  async searchHotels(searchParams) {
    const { city, checkInDate, checkOutDate, guests, roomType } = searchParams;

    const query = {
      "location.city": new RegExp(city, "i"),
      status: "active",
    };

    let hotels = await Hotel.find(query).sort({ rating: -1 });

    // Filter by room availability if specified
    if (roomType && guests) {
      hotels = hotels.filter((hotel) => {
        const room = hotel.roomTypes.find((r) => r.name === roomType);
        return room && room.availableRooms > 0 && room.maxGuests >= guests;
      });
    }

    return hotels;
  }

  // Check room availability
  async checkAvailability(hotelId, roomType, numberOfRooms) {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    const room = hotel.roomTypes.find((r) => r.name === roomType);

    if (!room) {
      throw new Error("Room type not found");
    }

    if (room.availableRooms < numberOfRooms) {
      throw new Error("Not enough rooms available");
    }

    return {
      available: true,
      availableRooms: room.availableRooms,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
    };
  }

  // Update room availability (used during booking)
  async updateRoomAvailability(
    hotelId,
    roomType,
    numberOfRooms,
    operation = "decrease"
  ) {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    const room = hotel.roomTypes.find((r) => r.name === roomType);

    if (!room) {
      throw new Error("Room type not found");
    }

    if (operation === "decrease") {
      if (room.availableRooms < numberOfRooms) {
        throw new Error("Not enough rooms available");
      }
      room.availableRooms -= numberOfRooms;
    } else {
      room.availableRooms += numberOfRooms;
    }

    await hotel.save();
    return hotel;
  }

  // Calculate total price
  calculateTotalPrice(pricePerNight, checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  }
}

module.exports = new HotelService();
