import '../styles/flight-hero.css'
const FlightHero = () => {
  return (
    <>
      <section className="flight-hero pt-5 pb-5">
        <div className="container">
          <div className="row text-center">
            <div className="col">
              <div className="hero-text">
                <p className="text-white hero-heading mb-3 fs-3 fw-bold">
                  Create your travel wish list and leave the rest for us.
                </p>
                <p className="fs-5 text-white fw-bolder">Special offers to suit your plan.</p>
              </div>
              <div className="search-section mt-5">
                <a>
                  <i className="ri-map-pin-line"></i> From
                </a>
                <a>
                  <i className="ri-navigation-fill"></i> To
                </a>
                <a>
                  <i className="ri-calendar-line"></i> Date of stay
                </a>
                <a>
                  <i className="ri-user-line"></i> Traveler
                </a>
                <button>Find trip now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightHero;
