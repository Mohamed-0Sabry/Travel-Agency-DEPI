import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useBookingStore } from "@/store/useBookingStore";
import type {
  CartItem,
  Flight,
  Hotel,
  PaymentMethod,
  AddPaymentMethodData,
} from "@/types/api.types";
import "@/styles/checkoutPage.css";

const detectCardType = (cardNumber: string): AddPaymentMethodData["cardType"] => {
  if (!cardNumber) return "VISA";
  const trimmed = cardNumber.replace(/\s+/g, "");
  if (/^4/.test(trimmed)) return "VISA";
  if (/^5[1-5]/.test(trimmed)) return "MASTERCARD";
  if (/^3[47]/.test(trimmed)) return "AMEX";
  if (/^6/.test(trimmed)) return "DISCOVER";
  return "VISA";
};

const lastFour = (cardNumber: string) => {
  const trimmed = cardNumber.replace(/\s+/g, "");
  return trimmed.slice(-4) || "";
};

const formatDateSafe = (d?: string | Date) => {
  if (!d) return "N/A";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading, getCart, clearCart } = useCartStore();
  const {
    paymentMethods,
    isLoading: paymentLoading,
    getPaymentMethods,
    processPayment,
    addPaymentMethod,
  } = usePaymentStore();
  const { checkoutCart, isLoading: bookingLoading } = useBookingStore();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [newPaymentForm, setNewPaymentForm] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    billingStreet: "",
    billingCity: "",
    billingCountry: "",
    billingPostalCode: "",
    isDefault: false,
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    getCart();
    getPaymentMethods();
  }, [getCart, getPaymentMethods]);

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.price, 0);
  };

  const calculateTax = () => calculateTotal() * 0.1; const calculateGrandTotal = () => calculateTotal() + calculateTax();

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newPaymentForm.cardNumber ||
      !newPaymentForm.cardholderName ||
      !newPaymentForm.expiryDate ||
      !newPaymentForm.billingStreet ||
      !newPaymentForm.billingCity ||
      !newPaymentForm.billingCountry ||
      !newPaymentForm.billingPostalCode
    ) {
      alert("Please fill all required payment and billing fields.");
      return;
    }

    const cardType = detectCardType(newPaymentForm.cardNumber);
    const payload: AddPaymentMethodData = {
      cardType,
      lastFourDigits: lastFour(newPaymentForm.cardNumber),
      cardholderName: newPaymentForm.cardholderName,
      expiryDate: newPaymentForm.expiryDate,
      isDefault: newPaymentForm.isDefault,
      billingAddress: {
        street: newPaymentForm.billingStreet,
        city: newPaymentForm.billingCity,
        country: newPaymentForm.billingCountry,
        postalCode: newPaymentForm.billingPostalCode,
      },
    };

    try {
      await addPaymentMethod(payload);
      setShowAddPayment(false);
      setNewPaymentForm({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
        billingStreet: "",
        billingCity: "",
        billingCountry: "",
        billingPostalCode: "",
        isDefault: false,
      });
    } catch (err) {
      console.error("Failed to add payment method:", err);
      alert("Failed to add payment method. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (!contactInfo.email || !contactInfo.phone) {
      alert("Please provide contact information");
      return;
    }

    try {
      setProcessingPayment(true);

      await processPayment({
        paymentMethodId: selectedPaymentMethod,
        amount: calculateGrandTotal(),
      });

      await checkoutCart({
        paymentMethodId: selectedPaymentMethod,
      });

      await clearCart();

      alert("Booking successful! Redirecting to your dashboard...");
      navigate("/account");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const isLoading = cartLoading || paymentLoading || bookingLoading;
  const totalItems = cart?.items?.length || 0;

  const getFlightFromItem = (item: CartItem): Flight | null => {
    if (!item.flight) return null;
    return typeof item.flight === "string" ? null : item.flight;
  };
  const getHotelFromItem = (item: CartItem): Hotel | null => {
    if (!item.hotel) return null;
    return typeof item.hotel === "string" ? null : item.hotel;
  };

  if (isLoading && !cart) {
    return (
      <div className="checkout-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!cart || totalItems === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <div className="empty-cart-message">
            <i className="fa-solid fa-cart-shopping empty-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Add some flights or hotels to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Browse Flights & Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container py-5">
        <div className="row">
          {/* Left Column - Checkout Form */}
          <div className="col-lg-8">
            <div className="checkout-section">
              <h2 className="section-title">
                <i className="fa-solid fa-circle-check me-2"></i>
                Checkout
              </h2>

              {/* Contact Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>
                    <i className="fa-solid fa-user me-2"></i>
                    Contact Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        className="form-control"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, email: e.target.value })
                        }
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="tel"
                        className="form-control"
                        value={contactInfo.phone}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>
                    <i className="fa-solid fa-credit-card me-2"></i>
                    Payment Method
                  </h5>
                </div>
                <div className="card-body">
                  {paymentMethods.length === 0 ? (
                    <div className="alert alert-info">
                      No saved payment methods. Add one below.
                    </div>
                  ) : (
                    <div className="payment-methods-list">
                      {paymentMethods.map((method: PaymentMethod) => (
                        <div
                          key={method._id}
                          className={`payment-method-item ${selectedPaymentMethod === method._id ? "selected" : ""
                            }`}
                          onClick={() => setSelectedPaymentMethod(method._id)}
                          role="button"
                          tabIndex={0}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === method._id}
                            onChange={() => setSelectedPaymentMethod(method._id)}
                          />
                          <div className="payment-method-info">
                            <i className="fa-solid fa-credit-card me-2"></i>
                            <span>
                              {method.cardType} ending in {method.lastFourDigits || "****"}
                            </span>
                            {method.isDefault && (
                              <span className="badge bg-primary ms-2">Default</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => setShowAddPayment(!showAddPayment)}
                  >
                    <i className="fa-solid fa-plus me-2"></i>
                    Add New Payment Method
                  </button>

                  {showAddPayment && (
                    <form onSubmit={handleAddPaymentMethod} className="mt-4">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            value={newPaymentForm.cardholderName}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                cardholderName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            value={newPaymentForm.cardNumber}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                cardNumber: e.target.value,
                              })
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            value={newPaymentForm.expiryDate}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                expiryDate: e.target.value,
                              })
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            value={newPaymentForm.cvv}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                cvv: e.target.value,
                              })
                            }
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>

                        <div className="col-md-4 mb-3 d-flex align-items-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="isDefault"
                              checked={newPaymentForm.isDefault}
                              onChange={(e) =>
                                setNewPaymentForm({
                                  ...newPaymentForm,
                                  isDefault: e.target.checked,
                                })
                              }
                            />
                            <label className="form-check-label" htmlFor="isDefault">
                              Set as default
                            </label>
                          </div>
                        </div>

                        {/* Billing address fields */}
                        <div className="col-12">
                          <h6 className="mt-3">Billing Address</h6>
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            placeholder="Enter street address"
                            className="form-control"
                            value={newPaymentForm.billingStreet}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                billingStreet: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter city"
                            value={newPaymentForm.billingCity}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                billingCity: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter country"
                            value={newPaymentForm.billingCountry}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                billingCountry: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter postal code"
                            value={newPaymentForm.billingPostalCode}
                            onChange={(e) =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                billingPostalCode: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? "Adding..." : "Add Payment Method"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <h4>Order Summary</h4>

              <div className="summary-items">
                {cart.items.map((item: CartItem) => {
                  const flight = getFlightFromItem(item);
                  const hotel = getHotelFromItem(item);

                  const title =
                    item.itemType === "flight"
                      ? flight
                        ? flight.description ||
                        `${flight.origin.city} → ${flight.destination.city}`
                        : "Flight Booking"
                      : hotel
                        ? hotel.hotelName
                        : "Hotel Booking";

                  const subtitle =
                    item.itemType === "flight" && flight
                      ? `${flight.origin.city} → ${flight.destination.city}`
                      : item.itemType === "hotel" && hotel
                        ? `${hotel.location.city}, ${hotel.location.country}`
                        : "";

                  return (
                    <div key={item._id} className="summary-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="item-type">
                          <i
                            className={`fa-solid ${item.itemType === "flight" ? "fa-plane" : "fa-hotel"
                              } me-2`}
                          ></i>
                          <strong>{title}</strong>
                        </div>
                        {subtitle && <small className="text-muted">{subtitle}</small>}
                        <div className="small mt-1 text-muted">
                          {item.itemType === "flight" && (
                            <>
                              <span>Class: {item.travelClass}</span>
                              <span className="mx-2">•</span>
                              <span>Passengers: {item.passengers}</span>
                              {item.checkOutDate && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{formatDateSafe(item.checkOutDate)}</span>
                                </>
                              )}
                            </>
                          )}
                          {item.itemType === "hotel" && (
                            <>
                              <span>
                                {item.roomType || "Room"}
                              </span>
                              {item.checkInDate && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span> {formatDateSafe(item.checkInDate)}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="item-price">${item.price.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-totals mt-4">
                <div className="summary-row d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row d-flex justify-content-between">
                  <span>Tax (10%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total d-flex justify-content-between mt-2">
                  <strong>Total:</strong>
                  <strong>${calculateGrandTotal().toFixed(2)}</strong>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 checkout-btn mt-3"
                onClick={handleCheckout}
                disabled={processingPayment || isLoading}
              >
                {processingPayment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock me-2"></i>
                    Complete Booking
                  </>
                )}
              </button>

              <div className="security-badges mt-3">
                <small className="text-muted d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-shield-halved me-2"></i>
                  Secure Payment Processing
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
