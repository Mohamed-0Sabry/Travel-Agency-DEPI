import React, { useEffect, useState } from "react";
import Card from "@/Components/Card";
import Loading from "@/Components/Loading";
import RatingStars from "@/Features/RatingStars";
import type { Hotel } from "@/types/api.types";
import { useHotelStore } from "@/store/useHotelStore";
import axiosInstance from "@/networks/axiosInstance";
import HotelDetails from "./HotelDetails";

const HotelsList: React.FC = () => {
  const hotels: Hotel[] = useHotelStore((s) => s.hotels);
  const loading: boolean = useHotelStore((s) => s.isLoading);
  const error: string | null = useHotelStore((s) => s.error);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  useEffect(() => {
    useHotelStore.getState().getHotels();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-danger">{error}</p>;

  if (selectedHotelId) {
    return (
      <HotelDetails
        hotelId={selectedHotelId}
        onBack={() => setSelectedHotelId(null)}
      />
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {hotels.map((hotel) => {
          const imagePath = (hotel.images && hotel.images[0]) || hotel.hotelLogo || "";
          const imageUrl = imagePath
            ? `${axiosInstance.defaults.baseURL}/uploads/Hotel-2.webp`
            : "/placeholder-hotel.jpg";

          
          const cheapestRoomPrice =
            hotel.roomTypes && hotel.roomTypes.length > 0
              ? Math.min(...hotel.roomTypes.map((r) => r.pricePerNight || Infinity))
              : 0;

          return (
            <div key={hotel._id} className="col-lg-3 col-md-6 col-12 mb-4">
              <Card
                img={imageUrl}
                imgClass="card-img-top destination-img"
                alt={`${hotel.hotelName} image`}
                cardClass="card shadow-sm overflow-hidden position-relative"
                bodyClass="card-body p-3"
              >
                <div
                  className="position-absolute top-0 end-0 m-3 price-badge rounded-3 px-3 py-2 bg-white bg-opacity-90 border"
                  style={{ zIndex: 5 }}
                >
                  <div className="text-end">
                    <small className="text-muted">From</small>
                    <div className="fw-bold">${cheapestRoomPrice}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 className="h5 mb-1">{hotel.hotelName}</h3>
                    <p className="mb-2 text-muted small">
                      {hotel.location.city}, {hotel.location.country}
                    </p>
                    <RatingStars rating={hotel.rating} />
                  </div>

                  <div className="text-end">
                    <div className="mb-2">
                      <span className="badge bg-primary">Top Pick</span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedHotelId(hotel._id)}
                    >
                      Details
                    </button>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-sm btn-success flex-grow-1"
                    onClick={() => setSelectedHotelId(hotel._id)}
                  >
                    View & Book
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">Save</button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelsList;
