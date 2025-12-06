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



