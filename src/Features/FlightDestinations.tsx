import React, { useEffect,useState } from "react";
import Card from "../Components/Card";
import FlightDetails from "./FlightDetails";
import RatingStars from "../Features/RatingStars";
import type { Flight } from "@/types/Flight";
import useFlightStore from "@/store/useFlightStore";
import axiosInstance from "@/networks/axiosInstance";
import Loading from "@/Components/Loading";
const Destination: React.FC = () => {
  const flights: Flight[] = useFlightStore((state) => state.activeOffers);
  const loading: boolean = useFlightStore((state) => state.loading);
  const error: string | null = useFlightStore((state) => state.error);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  useEffect(() => {
    useFlightStore.getState().fetchOffers();
  }, []);
  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
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
      <style>{`
        .destination-img { height: 220px; object-fit: cover; }
        .price-badge { backdrop-filter: blur(4px); }
      `}</style>

      <div className="row justify-content-center">
        {flights.map((flight) => {
          //Backend\src\uploads
          const imageUrl = `${
            axiosInstance.defaults.baseURL
          }/uploads/${flight.image.replace(/\\/g, "/")}`;
          return (
            <div key={flight._id} className="col-lg-3 col-md-8 col-12 mb-4">
              <Card
                img={imageUrl} // Use URL instead of filesystem path
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
                    <button className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelectedFlightId(flight._id)}
                    >
                      Details
                    </button>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-sm btn-success flex-grow-1">
                    Book Now
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
