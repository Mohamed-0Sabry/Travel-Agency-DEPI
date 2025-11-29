const Booking = require('../models/Booking');
const Cart = require('../models/Cart');
const Flight = require('../models/FlightsModified');
const Hotel = require('../models/Hotel');
const flightService = require('./flightService');
const hotelService = require('./hotelService');

class BookingService {
    // Create flight booking
    async createFlightBooking(userId, bookingData) {
        const { flightId, flightClass, passengers, seat, paymentMethodId } = bookingData;

        // Get flight details
        const flight = await Flight.findById(flightId);
        if (!flight) {
            throw new Error('Flight not found');
        }

        // Check availability
        await flightService.checkAvailability(flightId, flightClass, passengers);

        // Get class info for price
        const classInfo = flight.classes.find(c => c.name === flightClass);
        const totalPrice = classInfo.price * passengers;

        // Update seat availability
        await flightService.updateSeatAvailability(flightId, flightClass, passengers, 'decrease');

        // Create booking
        const booking = await Booking.create({
            user: userId,
            bookingType: 'flight',
            flight: flightId,
            flightDetails: {
                flightNumber: flight.flightNumber,
                airline: flight.airline,
                airlineLogo: flight.airlineLogo,
                departureTime: flight.departureTime,
                arrivalTime: flight.arrivalTime,
                departureAirport: flight.departureAirport,
                arrivalAirport: flight.arrivalAirport,
                date: flight.date,
                flightDuration: flight.flightDuration,
                gate: flight.gate,
                seat: seat || 'TBA',
                class: flightClass
            },
            totalPrice,
            paymentMethod: paymentMethodId,
            status: 'confirmed',
            paymentStatus: 'paid'
        });

        return await Booking.findById(booking._id).populate('user').populate('flight');
    }

    // Create hotel booking
    async createHotelBooking(userId, bookingData) {
        const { hotelId, roomType, checkInDate, checkOutDate, numberOfGuests, paymentMethodId } = bookingData;

        // Get hotel details
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // Check availability
        const availability = await hotelService.checkAvailability(hotelId, roomType, 1);

        // Calculate total price
        const numberOfNights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        const totalPrice = availability.pricePerNight * numberOfNights;

        // Update room availability
        await hotelService.updateRoomAvailability(hotelId, roomType, 1, 'decrease');

        // Create booking
        const booking = await Booking.create({
            user: userId,
            bookingType: 'hotel',
            hotel: hotelId,
            hotelDetails: {
                hotelName: hotel.hotelName,
                hotelLogo: hotel.hotelLogo,
                checkInDate,
                checkOutDate,
                checkInTime: hotel.checkInTime,
                checkOutTime: hotel.checkOutTime,
                roomNumber: 'On arrival',
                roomType,
                numberOfGuests,
                numberOfNights,
                pricePerNight: availability.pricePerNight
            },
            totalPrice,
            paymentMethod: paymentMethodId,
            status: 'confirmed',
            paymentStatus: 'paid'
        });

        return await Booking.findById(booking._id).populate('user').populate('hotel');
    }

    // Checkout cart (create bookings for all cart items)
    async checkoutCart(userId, paymentMethodId) {
        const cart = await Cart.findOne({ user: userId })
            .populate('items.flight')
            .populate('items.hotel');

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const bookings = [];

        // Process each cart item
        for (const item of cart.items) {
            try {
                if (item.itemType === 'flight') {
                    const booking = await this.createFlightBooking(userId, {
                        flightId: item.flight._id,
                        flightClass: item.flightClass,
                        passengers: item.passengers,
                        paymentMethodId
                    });
                    bookings.push(booking);
                } else if (item.itemType === 'hotel') {
                    const booking = await this.createHotelBooking(userId, {
                        hotelId: item.hotel._id,
                        roomType: item.roomType,
                        checkInDate: item.checkInDate,
                        checkOutDate: item.checkOutDate,
                        numberOfGuests: item.numberOfGuests,
                        paymentMethodId
                    });
                    bookings.push(booking);
                }
            } catch (error) {
                console.error(`Error booking item: ${error.message}`);
                // Continue with other items
            }
        }

        // Clear cart after successful bookings
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        return bookings;
    }

    // Get user bookings
    async getUserBookings(userId, filters = {}) {
        const query = { user: userId };

        if (filters.bookingType) {
            query.bookingType = filters.bookingType;
        }
        if (filters.status) {
            query.status = filters.status;
        }

        const bookings = await Booking.find(query)
            .populate('flight')
            .populate('hotel')
            .sort({ createdAt: -1 });

        return bookings;
    }

    // Get single booking
    async getBookingById(bookingId, userId) {
        const booking = await Booking.findOne({ _id: bookingId, user: userId })
            .populate('flight')
            .populate('hotel')
            .populate('paymentMethod');

        if (!booking) {
            throw new Error('Booking not found');
        }

        return booking;
    }

    // Get all bookings (Admin)
    async getAllBookings(filters = {}) {
        const query = {};

        if (filters.bookingType) {
            query.bookingType = filters.bookingType;
        }
        if (filters.status) {
            query.status = filters.status;
        }

        const bookings = await Booking.find(query)
            .populate('user')
            .populate('flight')
            .populate('hotel')
            .sort({ createdAt: -1 });

        return bookings;
    }

    // Cancel booking
    async cancelBooking(bookingId, userId) {
        const booking = await Booking.findOne({ _id: bookingId, user: userId });

        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled');
        }

        if (booking.status === 'completed') {
            throw new Error('Cannot cancel completed booking');
        }

        // Restore availability
        if (booking.bookingType === 'flight') {
            await flightService.updateSeatAvailability(
                booking.flight,
                booking.flightDetails.class,
                1,
                'increase'
            );
        } else if (booking.bookingType === 'hotel') {
            await hotelService.updateRoomAvailability(
                booking.hotel,
                booking.hotelDetails.roomType,
                1,
                'increase'
            );
        }

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        return booking;
    }

    // Update booking status (Admin)
    async updateBookingStatus(bookingId, status) {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            throw new Error('Booking not found');
        }

        booking.status = status;
        await booking.save();

        return booking;
    }
}

module.exports = new BookingService();