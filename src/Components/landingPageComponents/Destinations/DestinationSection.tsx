import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const DestinationsSection = () => {
  const [destinations, setDestinations] = useState([]);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  // ========================= FETCH FLIGHTS =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/flights")
      .then((res) => res.json())
      .then((body) => {
        const flights = Array.isArray(body)
          ? body
          : body?.data ?? body?.flights ?? [];

        if (!Array.isArray(flights)) {
          console.warn("Flights API did not return an array");
          setDestinations([]);
          setOffers([]);
          return;
        }

        // ---------- TOP DESTINATIONS ----------
        const mappedDestinations = flights.map((flight: any) => ({
          id: flight._id,
          image: flight.image
            ? `http://localhost:5000/api/uploads/${flight.image}`
            : "https://via.placeholder.com/600x400?text=Destination",
          title:
            typeof flight.destination === "string"
              ? flight.destination
              : flight.destination?.city ?? "Unknown",
          location: flight.destination?.country ?? "",
        }));

        setDestinations(mappedDestinations);

        // ---------- SPECIAL OFFERS ----------
        const mappedOffers = flights
          .filter((f: any) => f.offer?.isActive === true)
          .map((flight: any) => {
            const oldP = flight.offer.oldPrice ?? flight.price;
            const newP = flight.offer.newPrice ?? flight.price;

            return {
              id: flight._id,
              image: flight.image
                ? `http://localhost:5000/api/uploads/${flight.image}`
                : "https://via.placeholder.com/600x400?text=Offer",
              title: `${flight.destination.city}, ${flight.destination.country}`,
              description: flight.description?.slice(0, 80) + "...",
              oldPrice: oldP,
              newPrice: newP,
              discount: Math.round(((oldP - newP) / oldP) * 100),
              badge: flight.offer?.badge ?? "Hot Offer",
            };
          });

        setOffers(mappedOffers);
      })
      .catch((err) => {
        console.error("Error fetching flights:", err);
        setDestinations([]);
        setOffers([]);
      });
  }, []);

  // Filters UI only
  const filterButtons = [
    "All Destinations",
    "Beach Paradise",
    "Mountain Retreat",
    "City Explorer",
    "Cultural Tour",
  ];

  return (
    <div className="destinations-section">
      {/* ============================= TOP DESTINATIONS ============================= */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Top Destinations</div>
              <h2 className="display-5 fw-bold mb-3">
                Discover Your <span className="text-gradient">Love</span>
              </h2>
              <p className="text-muted fs-6">
                Explore the world's most beautiful destinations handpicked just
                for you
              </p>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="destinations-swiper pb-5"
          >
            {destinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="destination-card">
                  <div className="destination-image">
                    <img src={destination.image} alt={destination.title} />
                    <div className="destination-overlay"></div>
                  </div>

                  <div className="destination-content">
                    <h5 className="destination-title">{destination.title}</h5>
                    <p className="destination-location">
                      <i className="ri-map-pin-line me-2"></i>
                      {destination.location}
                    </p>

                    {/* Navigate to flight details */}
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => navigate(`/flights/${destination.id}`)}
                    >
                      Explore <i className="ri-arrow-right-line ms-2"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ============================= SPECIAL OFFERS ============================= */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Special Offers</div>
              <h2 className="display-5 fw-bold mb-3">
                Exclusive <span className="text-gradient">Deals</span> &
                Discounts
              </h2>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="offers-swiper pb-5"
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id}>
                <div className="offer-card">
                  <div className="offer-image">
                    <img src={offer.image} alt={offer.title} />
                    <div className="discount-badge">{offer.discount}% OFF</div>
                  </div>

                  <div className="offer-content">
                    <h5 className="offer-title mb-2">{offer.title}</h5>
                    <p className="offer-description text-muted">
                      {offer.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div>
                        <span className="text-muted small">From</span>
                        <h4 className="mb-0 fw-bold text-gradient">
                          €{offer.newPrice}
                        </h4>
                        <span className="text-decoration-line-through text-muted">
                          €{offer.oldPrice}
                        </span>
                      </div>

                      {/* Navigate to same FlightDetails page */}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/flights/${offer.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default DestinationsSection;
