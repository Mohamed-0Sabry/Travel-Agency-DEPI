import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-5 py-lg-6 bg-light">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image Column */}
          <div className="col-lg-6 order-lg-2">
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1000&fit=crop" 
                alt="Travel planning" 
                className="img-fluid rounded-4 shadow-lg main-image"
              />
              <div className="floating-card">
                <div className="d-flex align-items-center">
                  <div className="icon-box me-3">
                    <i className="ri-shield-check-line"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">100% Verified</h5>
                    <p className="mb-0 text-muted small">Trusted Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="col-lg-6 order-lg-1">
            <div className="section-badge mb-3">About Us</div>
            <h2 className="display-5 fw-bold mb-4">
              Plan Your <span className="text-gradient">Perfect Trip</span>
            </h2>
            <p className="text-muted fs-6 mb-4 lh-lg">
              Are you looking for an adventurous travel experience, or just want to work 
              while exploring new places? Your perfect trip starts with us. Phnes Travels 
              helps you discover amazing destinations, book flights, and find the best 
              local accommodations at your comfort.
            </p>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="ri-flight-takeoff-line"></i>
                  </div>
                  <h3 className="fw-bold mb-1">150+</h3>
                  <p className="text-muted mb-0">Flight Destinations</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="ri-hotel-line"></i>
                  </div>
                  <h3 className="fw-bold mb-1">250+</h3>
                  <p className="text-muted mb-0">Premium Hotels</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="ri-car-line"></i>
                  </div>
                  <h3 className="fw-bold mb-1">250+</h3>
                  <p className="text-muted mb-0">Elite Transportation</p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="ri-map-2-line"></i>
                  </div>
                  <h3 className="fw-bold mb-1">40+</h3>
                  <p className="text-muted mb-0">Travel Experiences</p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg">
              Explore More
              <i className="ri-arrow-right-line ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;