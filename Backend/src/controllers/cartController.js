const cartService = require('../services/cartService');

// Get user's cart
exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Add flight to cart
exports.addFlightToCart = async (req, res, next) => {
    try {
        const cart = await cartService.addFlightToCart(req.user.id, req.body);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Add hotel to cart
exports.addHotelToCart = async (req, res, next) => {
    try {
        const cart = await cartService.addHotelToCart(req.user.id, req.body);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await cartService.clearCart(req.user.id);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Update cart item
exports.updateCartItem = async (req, res, next) => {
    try {
        const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, req.body);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};