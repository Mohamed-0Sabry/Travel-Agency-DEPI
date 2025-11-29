const Cart = require('../models/Cart');
const Flight = require('../models/FlightsModified');
const Hotel = require('../models/Hotel');

class CartService {
    // Get user's cart
    async getCart(userId) {
        let cart = await Cart.findOne({ user: userId }).populate('items.flight').populate('items.hotel');

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        return cart;
    }

    // Add flight to cart
    async addFlightToCart(userId, flightData) {
        const { flightId, flightClass, passengers } = flightData;

        // Verify flight exists
        const flight = await Flight.findById(flightId);
        if (!flight) {
            throw new Error('Flight not found');
        }

        // Check class and availability
        const classInfo = flight.classes.find(c => c.name === flightClass);
        if (!classInfo) {
            throw new Error('Flight class not found');
        }
        if (classInfo.availableSeats < passengers) {
            throw new Error('Not enough seats available');
        }

        // Calculate price
        const price = classInfo.price * passengers;

        // Get or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Add item to cart
        cart.items.push({
            itemType: 'flight',
            flight: flightId,
            flightClass,
            passengers,
            price
        });

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
            const classInfo = flight.classes.find(c => c.name === item.flightClass);

            if (classInfo.availableSeats < updateData.passengers) {
                throw new Error('Not enough seats available');
            }

            item.passengers = updateData.passengers;
            item.price = classInfo.price * updateData.passengers;
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