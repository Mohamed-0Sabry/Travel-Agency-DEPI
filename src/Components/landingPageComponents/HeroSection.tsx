import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section position-relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop" 
          alt="Travel destination" 
          className="w-100 h-100 object-fit-cover"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="container position-relative" style={{zIndex: 10}}>
        <div className="row min-vh-100 align-items-center justify-content-center text-center">
          <div className="col-lg-10">
            <h1 className="display-2 fw-bold text-white mb-4 hero-title">
              Don't call it a dream. <br />
              <span className="text-gradient">Call it a plan</span>
            </h1>
            <p className="lead text-white mb-5 fs-5">
              Travel the way you wish to go with Phnes Travels helping you discover,
              live and travel at your own pace.
            </p>

            {/* Modern Search Card */}
            <div className="search-card mx-auto">
              <div className="row g-3 align-items-center">
                <div className="col-lg">
                  <div className="search-input-wrapper">
                    <i className="ri-map-pin-line search-icon"></i>
                    <input type="text" className="form-control search-input" placeholder="From" />
                  </div>
                </div>
                <div className="col-lg">
                  <div className="search-input-wrapper">
                    <i className="ri-compass-discover-line search-icon"></i>
                    <input type="text" className="form-control search-input" placeholder="To" />
                  </div>
                </div>
                <div className="col-lg">
                  <div className="search-input-wrapper">
                    <i className="ri-calendar-line search-icon"></i>
                    <input type="date" className="form-control search-input" />
                  </div>
                </div>
                <div className="col-lg">
                  <div className="search-input-wrapper">
                    <i className="ri-user-line search-icon"></i>
                    <select className="form-select search-input">
                      <option>1 Traveler</option>
                      <option>2 Travelers</option>
                      <option>3+ Travelers</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-auto">
                  <button className="btn btn-primary btn-lg w-100">
                    <span>Search Trips</span>
                    <i className="ri-search-line ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <i className="ri-arrow-down-line"></i>
      </div>
    </section>
  );
};

export default HeroSection;