import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import React from 'react';

const DestinationsSection = () => {
  const destinations = [
    { id: 1, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=800&fit=crop", title: "Yunnan Province", location: "China" },
    { id: 2, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=800&fit=crop", title: "Paris", location: "France" },
    { id: 3, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=800&fit=crop", title: "Big Buddha", location: "Thailand" },
    { id: 4, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=800&fit=crop", title: "Colosseum", location: "Rome, Italy" },
    { id: 5, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=800&fit=crop", title: "Zhangjiajie", location: "Hunan, China" },
    { id: 6, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=800&fit=crop", title: "Cappadocia", location: "Turkey" },
  ];

  const specialOffers = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop", 
      title: "Lisbon, Portugal", 
      description: "5 nights and 4 days in 5 star hotel, breakfast and lunch included. Experience the renaissance beauty.",
      price: "500",
      discount: "30"
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop", 
      title: "Cappadocia, Turkey", 
      description: "Experience the magical hot air balloon rides over the unique rock formations of Cappadocia.",
      price: "450",
      discount: "25"
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop", 
      title: "Santorini, Greece", 
      description: "Explore the stunning white architecture and breathtaking sunsets of this Greek paradise.",
      price: "650",
      discount: "20"
    },
  ];

  const packages = [
    { id: 1, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop", title: "Bali Adventure", price: "599", days: 7 },
    { id: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", title: "Iceland Explorer", price: "899", days: 10 },
    { id: 3, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", title: "Tokyo Experience", price: "750", days: 8 },
    { id: 4, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop", title: "Paris Romance", price: "680", days: 6 },
    { id: 5, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop", title: "Swiss Alps", price: "950", days: 9 },
    { id: 6, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop", title: "Maldives Luxury", price: "1200", days: 7 },
  ];

  const flights = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop", 
      destination: "New York, USA", 
      badge: "LIMITED TIME", 
      price: "349", 
      originalPrice: "499", 
      details: "Round-trip with 23kg baggage" 
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop", 
      destination: "Tokyo, Japan", 
      badge: "MOST POPULAR", 
      price: "699", 
      originalPrice: "899", 
      details: "Premium economy flexible booking" 
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop", 
      destination: "Paris, France", 
      badge: "30% OFF", 
      price: "199", 
      originalPrice: "299", 
      details: "Direct flight with free seat" 
    },
  ];

  const filterButtons = ["All Destinations", "Beach Paradise", "Mountain Retreat", "City Explorer", "Cultural Tour"];

  return (
    <div className="destinations-section">
      {/* Top Destinations */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Top Destinations</div>
              <h2 className="display-5 fw-bold mb-3">
                Discover Your <span className="text-gradient">Love</span>
              </h2>
              <p className="text-muted fs-6">
                Explore the world's most beautiful destinations handpicked just for you
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
              1200: { slidesPerView: 4 }
            }}
            className="destinations-swiper pb-5"
          >
            {destinations.map(destination => (
              <SwiperSlide key={destination.id}>
                <div className="destination-card">
                  <div className="destination-image">
                    <img src={destination.image} alt={destination.title} />
                    <div className="destination-overlay">
                    </div>
                  </div>
                  <div className="destination-content">
                    <h5 className="destination-title">{destination.title}</h5>
                    <p className="destination-location">
                      <i className="ri-map-pin-line me-2"></i>{destination.location}
                    </p>
                    <button className="btn btn-primary w-100">
                      Explore <i className="ri-arrow-right-line ms-2"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Special Offers</div>
              <h2 className="display-5 fw-bold mb-3">
                Exclusive <span className="text-gradient">Deals</span> & Discounts
              </h2>
              <p className="text-muted fs-6">
                Don't miss out on our limited-time offers and save big on your next adventure
              </p>
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
              1200: { slidesPerView: 3 }
            }}
            className="offers-swiper pb-5"
          >
            {specialOffers.map(offer => (
              <SwiperSlide key={offer.id}>
                <div className="offer-card">
                  <div className="offer-image">
                    <img src={offer.image} alt={offer.title} />
                    <div className="discount-badge">{offer.discount}% OFF</div>
                  </div>
                  <div className="offer-content">
                    <div className="rating mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-warning"></i>
                      ))}
                      <span className="ms-2 text-muted">(128 reviews)</span>
                    </div>
                    <h5 className="offer-title mb-2">{offer.title}</h5>
                    <p className="offer-description text-muted">{offer.description}</p>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                      <div className="price-info">
                        <span className="text-muted small">From</span>
                        <h4 className="mb-0 fw-bold text-gradient">€{offer.price}</h4>
                      </div>
                      <button className="btn btn-primary btn-sm">
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

      {/* Tour Packages */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Tour Packages</div>
              <h2 className="display-5 fw-bold mb-3">
                Curated <span className="text-gradient">Packages</span>
              </h2>
              <p className="text-muted fs-6">
                Handpicked travel packages designed to give you the best experiences
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-pills mb-5 text-center">
            {filterButtons.map((filter, index) => (
              <button 
                key={index} 
                className={`btn ${index === 0 ? 'btn-primary' : 'btn-outline-secondary'} btn-pill me-2 mb-2`}
              >
                {filter}
              </button>
            ))}
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 }
            }}
            className="packages-swiper pb-5"
          >
            {packages.map(pkg => (
              <SwiperSlide key={pkg.id}>
                <div className="package-card">
                  <div className="package-image">
                    <img src={pkg.image} alt={pkg.title} />
                    <div className="duration-badge">
                      <i className="ri-time-line me-1"></i> {pkg.days} Days
                    </div>
                  </div>
                  <div className="package-content">
                    <div className="rating mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-warning"></i>
                      ))}
                      <span className="ms-2 text-muted small">(89)</span>
                    </div>
                    <h5 className="package-title mb-3">{pkg.title}</h5>
                    <div className="package-features mb-3">
                      <div className="feature-item">
                        <i className="ri-hotel-line me-2"></i>
                        <span>5★ Hotel</span>
                      </div>
                      <div className="feature-item">
                        <i className="ri-restaurant-line me-2"></i>
                        <span>All Meals</span>
                      </div>
                      <div className="feature-item">
                        <i className="ri-plane-line me-2"></i>
                        <span>Transfers</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="price-info">
                        <span className="text-muted small">Starting at</span>
                        <h4 className="mb-0 fw-bold text-gradient">€{pkg.price}</h4>
                      </div>
                      <button className="btn btn-primary">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Flights Section */}
      <section className="py-5 py-lg-6 bg-gradient-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3 bg-white">Special Deals</div>
              <h2 className="display-5 fw-bold mb-3 text-white">
                Best Flight Offers
              </h2>
              <p className="text-white fs-6 opacity-75">
                Fly to your dream destination at unbeatable prices
              </p>
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
              1200: { slidesPerView: 3 }
            }}
            className="flights-swiper pb-5"
          >
            {flights.map(flight => (
              <SwiperSlide key={flight.id}>
                <div className="flight-card">
                  <div className="flight-image">
                    <img src={flight.image} alt={flight.destination} />
                    <div className={`flight-badge ${flight.badge.includes('POPULAR') ? 'badge-popular' : flight.badge.includes('OFF') ? 'badge-discount' : 'badge-limited'}`}>
                      {flight.badge}
                    </div>
                  </div>
                  <div className="flight-content">
                    <h5 className="flight-destination mb-3">
                      <i className="ri-plane-line me-2 text-gradient"></i>
                      {flight.destination}
                    </h5>
                    <p className="flight-details text-muted mb-3">{flight.details}</p>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="price-comparison">
                        <span className="original-price">€{flight.originalPrice}</span>
                        <div className="current-price">€{flight.price}</div>
                      </div>
                      <div className="savings-badge">
                        Save €{parseInt(flight.originalPrice) - parseInt(flight.price)}
                      </div>
                    </div>
                    <button className="btn btn-primary w-100">
                      Book Flight Now
                      <i className="ri-arrow-right-line ms-2"></i>
                    </button>
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