import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card";
import FlightDetails from "./FlightDetails";
import RatingStars from "../Features/RatingStars";
import type { Flight } from "@/types/Flight";
import useFlightStore from "@/store/useFlightStore";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/networks/axiosInstance";
import Loading from "@/Components/Loading";

const Destination: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const flights: Flight[] = useFlightStore((state) => state.flights);
  const loading: boolean = useFlightStore((state) => state.loading);
  const error: string | null = useFlightStore((state) => state.error);
  
  const { addFlightToCart, isLoading: isAddingToCart, error: cartError } = useCartStore();
  
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(
    id ?? null
  );
  const [addingFlightId, setAddingFlightId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    useFlightStore.getState().fetchFlights();
  }, []);
  
  useEffect(() => {
    if (id) {
      setSelectedFlightId(id);
    }
  }, [id]);

  useEffect(() => {
    if (cartError) {
      // Clear error after 3 seconds
      const timer = setTimeout(() => {
        useCartStore.getState().clearError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartError]);

  useEffect(() => {
    if (successMessage) {
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddToCart = async (flight: Flight) => {
    setAddingFlightId(flight._id);
    try {
      await addFlightToCart({
        flightId: flight._id,
        travelClass: 'Economy', // Default to Economy
        passengers: 1, // Default to 1 passenger
      });
      setSuccessMessage(`${flight.destination.city} flight added to cart!`);
    } catch (err) {
      console.error('Failed to add flight to cart:', err);
    } finally {
      setAddingFlightId(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  
  if (selectedFlightId) {
    return (
      <FlightDetails
        flightId={selectedFlightId}
        onBack={() => setSelectedFlightId(null)}
      />
    );
  }

  return (
    <div className="container py-4">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Error Message */}
      {cartError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {cartError}
          <button
            type="button"
            className="btn-close"
            onClick={() => useCartStore.getState().clearError()}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row justify-content-center">
        {flights.map((flight) => {
          const imageUrl = `${
            axiosInstance.defaults.baseURL
          }/uploads/${flight.image.replace(/\\/g, "/")}`;
          const isAdding = addingFlightId === flight._id;
          
          return (
            <div key={flight._id} className="col-lg-3 col-md-8 col-12 mb-4">
              <Card
                img={imageUrl} 
                imgClass="card-img-top destination-img"
                alt={`${flight.destination.city} image`}
                cardClass="card shadow-sm overflow-hidden position-relative"
                bodyClass="card-body p-3"
              >
                <div
                  className="position-absolute top-0 end-0 m-3 price-badge rounded-3 px-3 py-2 bg-white bg-opacity-90 border"
                  style={{ zIndex: 5 }}
                >
                  <div className="text-end">
                    <small className="text-muted">From</small>
                    <div className="fw-bold">${flight.price}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 className="h5 mb-1">{flight.destination.city}</h3>
                    <p className="mb-2 text-muted small">
                      {flight.destination.country}
                    </p>
                    <RatingStars rating={flight.rating} />
                  </div>
                  <div className="text-end">
                    <div className="mb-2">
                      <span className="badge bg-primary">Popular</span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedFlightId(flight._id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-success flex-grow-1"
                    onClick={() => handleAddToCart(flight)}
                    disabled={isAdding || isAddingToCart}
                  >
                    {isAdding ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Save
                  </button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Destination;