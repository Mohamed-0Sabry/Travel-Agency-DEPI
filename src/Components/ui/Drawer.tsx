import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem, Flight, Hotel } from "@/types/api.types";
import "@/styles/cartDrawer.css";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, isLoading, error, getCart, removeFromCart, clearError } =
    useCartStore();

  useEffect(() => {
    if (isOpen) getCart();
  }, [isOpen, getCart]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const calculateTotal = () =>
    cart?.items.reduce((total, item) => total + item.price, 0) || 0;

  const totalItems = cart?.items?.length || 0;

  const getFlightData = (item: CartItem): Flight | null => {
    if (!item.flight) return null;
    return typeof item.flight === "string" ? null : item.flight;
  };

  const getHotelData = (item: CartItem): Hotel | null => {
    if (!item.hotel) return null;
    return typeof item.hotel === "string" ? null : item.hotel;
  };

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>
            <i className="fa-solid fa-cart-shopping me-2"></i>
            Shopping Cart ({totalItems})
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="cart-drawer-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="cart-loading">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : !cart || totalItems === 0 ? (
            <div className="cart-empty">
              <i className="fa-solid fa-cart-shopping empty-icon"></i>
              <h4>Your cart is empty</h4>
              <p>Add flights or hotels to get started!</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.items.map((item) => {
                const flight = getFlightData(item);
                const hotel = getHotelData(item);

                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-type">
                        <i
                          className={`fa-solid ${
                            item.itemType === "flight"
                              ? "fa-plane"
                              : "fa-hotel"
                          } me-2`}
                        ></i>
                        <span className="badge bg-primary">
                          {item.itemType === "flight" ? "Flight" : "Hotel"}
                        </span>
                      </div>

                      {/* FLIGHT ITEM */}
                      {item.itemType === "flight" && flight && (
                        <div className="cart-item-details">
                          <h5>
                            {flight.description || "Flight Booking"}
                          </h5>

                          <p className="mb-1">
                            <strong>From:</strong> {flight.origin.city},{" "}
                            {flight.origin.country}
                            <i className="fa-solid fa-arrow-right mx-2"></i>
                            <strong>To:</strong> {flight.destination.city},{" "}
                            {flight.destination.country}
                          </p>

                          <p className="mb-1">
                            <strong>Class:</strong> {item.travelClass}
                          </p>

                          <p className="mb-1">
                            <strong>Passengers:</strong> {item.passengers}
                          </p>
                        </div>
                      )}

                      {/* HOTEL ITEM */}
                      {item.itemType === "hotel" && hotel && (
                        <div className="cart-item-details">
                          <h5>{hotel.hotelName || "Hotel Booking"}</h5>

                          <p className="mb-1">
                            <strong>Location:</strong>{" "}
                            {hotel.location.city}, {hotel.location.country}
                          </p>

                          <p className="mb-1">
                            <strong>Check-in:</strong>{" "}
                            {new Date(item.checkInDate || "").toLocaleDateString()}
                          </p>

                          <p className="mb-1">
                            <strong>Check-out:</strong>{" "}
                            {new Date(item.checkOutDate || "").toLocaleDateString()}
                          </p>

                          <p className="mb-1">
                            <strong>Room:</strong> {item.roomType}
                          </p>

                          <p className="mb-1">
                            <strong>Guests:</strong> {item.numberOfGuests}
                          </p>

                          {item.numberOfNights && (
                            <p className="mb-1">
                              <strong>Nights:</strong> {item.numberOfNights}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="cart-item-price">
                        <strong>${item.price.toFixed(2)}</strong>
                      </div>
                    </div>

                    <button
                      className="btn btn-danger btn-sm remove-btn"
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isLoading}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart && totalItems > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
            <button
              className="btn btn-primary w-100 checkout-btn"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              Proceed to Checkout
              <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
