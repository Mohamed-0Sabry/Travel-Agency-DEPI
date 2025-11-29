import React from "react";
import "../../../Styles/FlightOffers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

interface FlightOffer {
  id: number;
  image: string;
  destination: string;
  badge: {
    type: string;
    text: string;
  };
  discountPrice: string;
  originalPrice: string;
  description: string;
}

interface Props {
  flights?: FlightOffer[];
}

const FlightOffers: React.FC<Props> = ({ flights = [] }) => {
  return (
    <div className="Destinations-section">
      <div className="text">
        <span>Special Deals</span>
        <h1>Best Flight Offers</h1>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        autoplay={{ delay: 3500 }}
        className="flights-swiper destinations-swiper"
      >
        {flights.map((flight) => (
          <SwiperSlide key={flight.id}>
            <div className="Flights-card">
              <img src={flight.image} alt={flight.destination} />
              <div className="text">
                <div className={`deal-badge ${flight.badge.type}`}>
                  {flight.badge.text}
                </div>
                <h5>{flight.destination}</h5>

                <p className="price">
                  From{" "}
                  <span className="discount-price">{flight.discountPrice}</span>
                  <span className="to"> To </span>
                  <span className="original-price">{flight.originalPrice}</span>
                </p>

                <p className="details">{flight.description}</p>
                <button className="b-flight">BOOK NOW</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FlightOffers;
