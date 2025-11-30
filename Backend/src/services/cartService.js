const Cart = require('../models/Cart');
const Flight = require('../models/Flights');
const Hotel = require('../models/Hotel');

class CartService {
  // Get user's cart
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId })
      .populate('items.flight')
      .populate('items.hotel');
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    
    return cart;
  }

  // Add flight to cart
  async addFlightToCart(userId, flightData) {
    const { flightId, passengers = 1, travelClass = 'Economy' } = flightData;
    
    // Verify flight exists
    const flight = await Flight.findById(flightId);
    if (!flight) {
      throw new Error('Flight not found');
    }

    // Calculate price based on offer
    let pricePerPerson = flight.price;
    if (flight.offer && flight.offer.isActive && flight.offer.newPrice) {
      // Check if offer is still valid
      if (!flight.offer.expiresAt || new Date(flight.offer.expiresAt) > new Date()) {
        pricePerPerson = flight.offer.newPrice;
      }
    }

    const totalPrice = pricePerPerson * passengers;

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if flight already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.itemType === 'flight' && 
              item.flight && 
              item.flight.toString() === flightId &&
              item.travelClass === travelClass
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].passengers = passengers;
      cart.items[existingItemIndex].price = totalPrice;
    } else {
      // Add new item to cart
      cart.items.push({
        itemType: 'flight',
        flight: flightId,
        passengers,
        travelClass,
        price: totalPrice
      });
    }

    await cart.save();
    return await this.getCart(userId);
  }

  // Add hotel to cart
  async addHotelToCart(userId, hotelData) {
    const { hotelId, roomType, checkInDate, checkOutDate, numberOfGuests } = hotelData;
    
    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    // Check room type and availability
    const room = hotel.roomTypes.find(r => r.name === roomType);
    if (!room) {
      throw new Error('Room type not found');
    }
    if (room.availableRooms < 1) {
      throw new Error('No rooms available');
    }
    if (room.maxGuests < numberOfGuests) {
      throw new Error('Number of guests exceeds room capacity');
    }

    // Calculate nights and price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const price = room.pricePerNight * numberOfNights;

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Add item to cart
    cart.items.push({
      itemType: 'hotel',
      hotel: hotelId,
      roomType,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfNights,
      price
    });

    await cart.save();
    return await this.getCart(userId);
  }

  // Remove item from cart
  async removeFromCart(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    return await this.getCart(userId);
  }

  // Clear cart
  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    return cart;
  }

  // Update cart item
  async updateCartItem(userId, itemId, updateData) {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    // Update item based on type
    if (item.itemType === 'flight' && updateData.passengers) {
      const flight = await Flight.findById(item.flight);
      
      // Recalculate price
      let pricePerPerson = flight.price;
      if (flight.offer && flight.offer.isActive && flight.offer.newPrice) {
        if (!flight.offer.expiresAt || new Date(flight.offer.expiresAt) > new Date()) {
          pricePerPerson = flight.offer.newPrice;
        }
      }
      
      item.passengers = updateData.passengers;
      item.price = pricePerPerson * updateData.passengers;
      
      if (updateData.travelClass) {
        item.travelClass = updateData.travelClass;
      }
    } else if (item.itemType === 'hotel' && updateData.numberOfGuests) {
      const hotel = await Hotel.findById(item.hotel);
      const room = hotel.roomTypes.find(r => r.name === item.roomType);
      
      if (room.maxGuests < updateData.numberOfGuests) {
        throw new Error('Number of guests exceeds room capacity');
      }
      
      item.numberOfGuests = updateData.numberOfGuests;
    }

    await cart.save();
    return await this.getCart(userId);
  }
}

module.exports = new CartService();