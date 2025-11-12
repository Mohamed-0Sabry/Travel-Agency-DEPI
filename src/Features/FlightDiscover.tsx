import "../styles/flight-discover.css";
const FlightDiscover = () => {
  return (
    <section className="destinations pt-3 mt-3">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="flight-wrapper d-flex justify-content-between align-items-center">
              <div className="flight-head">
                <h6>Destinations</h6>
                <h2>Discover your love</h2>
              </div>
              <div className="flight-see-all">
                <button
                  type="button"
                  className="btn btn-outline-success ps-4 pe-4"
                >
                  See all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightDiscover;
