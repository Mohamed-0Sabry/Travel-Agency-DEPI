const Hotel = require('../models/Hotel');

class HotelService {
  // Get all hotels with filters
  async getAllHotels(filters = {}) {
    const query = { status: 'active' };
    
    if (filters.city) {
      query['location.city'] = new RegExp(filters.city, 'i');
    }
    if (filters.country) {
      query['location.country'] = new RegExp(filters.country, 'i');
    }
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    if (filters.hotelName) {
      query.hotelName = new RegExp(filters.hotelName, 'i');
    }

    const hotels = await Hotel.find(query).sort({ rating: -1 });
    return hotels;
  }

  // Get single hotel by ID
  async getHotelById(id) {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    return hotel;
  }

  // Create new hotel (Admin)
  async createHotel(hotelData) {
    const hotel = await Hotel.create(hotelData);
    return hotel;
  }

  // Update hotel (Admin)
  async updateHotel(id, updateData) {
    const hotel = await Hotel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      throw new Error('Hotel not found');
    }

    return hotel;
  }

  // Delete hotel (Admin)
  async deleteHotel(id) {
    const hotel = await Hotel.findByIdAndDelete(id);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    return { message: 'Hotel deleted successfully' };
  }

  // Search hotels
  async searchHotels(searchParams) {
    const { city, checkInDate, checkOutDate, guests, roomType } = searchParams;
    
    const query = {
      'location.city': new RegExp(city, 'i'),
      status: 'active'
    };

    let hotels = await Hotel.find(query).sort({ rating: -1 });

    // Filter by room availability if specified
    if (roomType && guests) {
      hotels = hotels.filter(hotel => {
        const room = hotel.roomTypes.find(r => r.name === roomType);
        return room && room.availableRooms > 0 && room.maxGuests >= guests;
      });
    }

    return hotels;
  }

  // Check room availability
  async checkAvailability(hotelId, roomType, numberOfRooms) {
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const room = hotel.roomTypes.find(r => r.name === roomType);
    
    if (!room) {
      throw new Error('Room type not found');
    }

    if (room.availableRooms < numberOfRooms) {
      throw new Error('Not enough rooms available');
    }

    return {
      available: true,
      availableRooms: room.availableRooms,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests
    };
  }

  // Update room availability (used during booking)
  async updateRoomAvailability(hotelId, roomType, numberOfRooms, operation = 'decrease') {
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const room = hotel.roomTypes.find(r => r.name === roomType);
    
    if (!room) {
      throw new Error('Room type not found');
    }

    if (operation === 'decrease') {
      if (room.availableRooms < numberOfRooms) {
        throw new Error('Not enough rooms available');
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