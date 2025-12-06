import React, { useEffect, useState } from "react";
import useFlightStore from "@/store/useFlightStore";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/networks/axiosInstance";
import type { Flight } from "@/types/Flight";
import RatingStars from "@/Features/RatingStars";
import Loading from "@/Components/Loading";
import "../styles/flightDetails.css";

interface FlightDetailsProps {
  flightId: string;
  onBack: () => void;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flightId, onBack }) => {
  const flights = useFlightStore((state) => state.flights);
  const loading = useFlightStore((state) => state.loading);
  const { addFlightToCart, isLoading: isAddingToCart, error: cartError } = useCartStore();
  
  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedClass, setSelectedClass] = useState<'Economy' | 'Business' | 'First Class'>('Economy');
  const [passengers, setPassengers] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (flights.length === 0) {
      useFlightStore.getState().fetchFlights();
    } else {
      const foundFlight = flights.find((f) => f._id === flightId);
      setFlight(foundFlight || null);
    }
  }, [flightId, flights]);

  useEffect(() => {
    if (flights.length > 0 && !flight) {
      const foundFlight = flights.find((f) => f._id === flightId);
      setFlight(foundFlight || null);
    }
  }, [flights, flightId, flight]);

  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => {
        useCartStore.getState().clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cartError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddToCart = async () => {
    if (!flight) return;
    
    try {
      await addFlightToCart({
        flightId: flight._id,
        travelClass: selectedClass,
        passengers: passengers,
      });
      setSuccessMessage(`Flight to ${flight.destination.city} added to cart successfully!`);
    } catch (err) {
      console.error('Failed to add flight to cart:', err);
    }
  };

  const calculateTotalPrice = () => {
    if (!flight) return 0;
    const classMultiplier = selectedClass === 'First Class' ? 3 : selectedClass === 'Business' ? 2 : 1;
    return flight.price * passengers * classMultiplier;
  };

  if (loading) return <Loading />;
  if (!flight)
    return (
      <div className="container py-5 text-center">
        <h3>Flight not found</h3>
        <button className="btn btn-primary mt-3" onClick={onBack}>
          Back to Flights
        </button>
      </div>
    );

  const imageUrl = `${
    axiosInstance.defaults.baseURL
  }/uploads/${flight.image.replace(/\\/g, "/")}`;

  return (
    <div className="container py-5">
      {/* Success Alert */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <span className="fs-4 me-2">✅</span>
            <div>
              <strong>Success!</strong> {successMessage}
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Error Alert */}
      {cartError && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <span className="fs-4 me-2">❌</span>
            <div>
              <strong>Error!</strong> {cartError}
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => useCartStore.getState().clearError()}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Back Button */}
      <button className="btn btn-outline-secondary mb-4" onClick={onBack}>
        ← Back
      </button>

      <div className="row g-4">
        {/* Image Section */}
        <div className="col-lg-8">
          <div className="position-relative">
            <img
              src={imageUrl}
              alt={flight.destination.city}
              className="w-100 flight-hero-img shadow-lg"
            />
            {flight.offer?.isActive && (
              <div className="position-absolute top-0 start-0 m-3">
                <span className="offer-badge shadow">
                  {Math.floor(
                    ((flight.offer.oldPrice! - flight.offer.newPrice!) /
                      flight.offer.oldPrice!) *
                      100
                  )}
                  % OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="col-lg-4">
          <div
            className="card shadow-lg border-0 sticky-top"
            style={{ top: "20px" }}
          >
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="price-display">${calculateTotalPrice()}</div>
                <small className="text-muted">total price</small>
              </div>

              {/* Travel Class Selection */}
              <div className="mb-3">
                <label className="form-label fw-bold">Travel Class</label>
                <select 
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value as 'Economy' | 'Business' | 'First Class')}
                >
                  <option value="Economy">Economy (${flight.price})</option>
                  <option value="Business">Business (${flight.price * 2})</option>
                  <option value="First Class">First Class (${flight.price * 3})</option>
                </select>
              </div>

              {/* Passengers Selection */}
              <div className="mb-3">
                <label className="form-label fw-bold">Passengers</label>
                <div className="input-group">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    disabled={passengers <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center"
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="9"
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setPassengers(Math.min(9, passengers + 1))}
                    disabled={passengers >= 9}
                  >
                    +
                  </button>
                </div>
                <small className="text-muted">Maximum 9 passengers</small>
              </div>

              <div className="d-grid gap-2 mb-3">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding to Cart...
                    </>
                  ) : (
                    <>🛒 Add to Cart</>
                  )}
                </button>
                <button className="btn btn-outline-secondary">
                  ❤️ Save for Later
                </button>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Rating</span>
                <RatingStars rating={flight.rating} />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Reviews</span>
                <span className="fw-bold">
                  {Math.floor(flight.rating * 234)} reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div className="row mt-5 g-4">
        <div className="col-lg-8">
          {/* Destination Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h2 className="h3 mb-3">
                {flight.destination.city}, {flight.destination.country}
              </h2>
              <p className="text-muted mb-4">{flight.description}</p>

              {/* Route Information */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="info-card bg-light p-3 rounded">
                    <h6 className="text-muted mb-2">✈️ Departure</h6>
                    <h5 className="mb-0">{flight.origin.city}</h5>
                    <small className="text-muted">
                      {flight.origin.country}
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-card bg-light p-3 rounded">
                    <h6 className="text-muted mb-2">📍 Arrival</h6>
                    <h5 className="mb-0">{flight.destination.city}</h5>
                    <small className="text-muted">
                      {flight.destination.country}
                    </small>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              {flight.offer?.isActive && (
                <div className="alert alert-success border-0 shadow-sm">
                  <h6 className="alert-heading">🏷️ Special Offer!</h6>
                  <p className="mb-0">
                    Get{" "}
                    <strong>
                      {Math.floor(
                        ((flight.offer.oldPrice! - flight.offer.newPrice!) /
                          flight.offer.oldPrice!) *
                          100
                      )}
                      % OFF 
                    </strong>{" "}
                    on this flight! Offer valid until{" "}
                    {new Date(flight.offer.expiresAt!).toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4">What's Included</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="feature-icon me-3">📶</div>
                    <div>
                      <h6 className="mb-1">Free Wi-Fi</h6>
                      <small className="text-muted">
                        Stay connected during your flight
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="feature-icon me-3">🍽️</div>
                    <div>
                      <h6 className="mb-1">Meals Included</h6>
                      <small className="text-muted">
                        Complimentary meals and drinks
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="feature-icon me-3">🧳</div>
                    <div>
                      <h6 className="mb-1">Baggage Allowance</h6>
                      <small className="text-muted">
                        23kg checked baggage included
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="feature-icon me-3">🎧</div>
                    <div>
                      <h6 className="mb-1">Entertainment</h6>
                      <small className="text-muted">
                        In-flight entertainment system
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="mb-3">ℹ️ Quick Facts</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 pb-3 border-bottom">
                  <small className="text-muted d-block">Flight Type</small>
                  <strong>International</strong>
                </li>
                <li className="mb-3 pb-3 border-bottom">
                  <small className="text-muted d-block">Average Duration</small>
                  <strong>8-12 hours</strong>
                </li>
                <li className="mb-3 pb-3 border-bottom">
                  <small className="text-muted d-block">Booking Class</small>
                  <strong>Economy / Business / First Class</strong>
                </li>
                <li>
                  <small className="text-muted d-block">Cancellation</small>
                  <strong>Free up to 24hrs</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body p-4">
              <h5 className="mb-3">❓ Need Help?</h5>
              <p className="mb-3 small">
                Our travel experts are available 24/7 to assist you
              </p>
              <button className="btn btn-light w-100">
                📞 Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;