const bookingService = require('../services/bookingService');

// Create flight booking
exports.createFlightBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createFlightBooking(req.user.id, req.body);
        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Create hotel booking
exports.createHotelBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createHotelBooking(req.user.id, req.body);
        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Checkout cart
exports.checkoutCart = async (req, res, next) => {
    try {
        const { paymentMethodId } = req.body;
        const bookings = await bookingService.checkoutCart(req.user.id, paymentMethodId);
        res.status(201).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// Get user bookings
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user.id, req.query);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// Get single booking
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookings (Admin)
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getAllBookings(req.query);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Update booking status (Admin)
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await bookingService.updateBookingStatus(req.params.id, status);
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};