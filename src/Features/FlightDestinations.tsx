import React from "react";
import Card from "../Components/Card"; // named import
import db from "../../db.json";
interface Destination {
  id: number;
  name: string;
  price: number;
  img: string;
  country: string;
  rating: number;
}
const destinations: Destination[] = db.destinations;
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const half = rating - fullStars >= 0.5;
  const empty = 5 - fullStars - (half ? 1 : 0);
  return (
    <div className="d-flex align-items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} style={{ color: "#f6c84c" }}>
          ★
        </span>
      ))}
      {half && <span style={{ color: "#f6c84c" }}>☆</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} style={{ color: "#d6d6d6" }}>
          ★
        </span>
      ))}
      <small className="text-muted ms-2">{rating.toFixed(1)}</small>
    </div>
  );
};

const BeautifulDestinationCard: React.FC = () => {
  return (
    <div className="container py-4">
      <style>{`
        .destination-img { height: 220px; object-fit: cover; }
        .price-badge { backdrop-filter: blur(4px); }
      `}</style>

      <div className="row justify-content-center">
        {destinations.map((destination) => (
          <div key={destination.id} className="col-lg-3 col-md-8 col-12 mb-4">
            <Card
              img={destination.img}
              imgClass="card-img-top destination-img"
              alt={`${destination.name} image`}
              cardClass="card shadow-sm overflow-hidden position-relative"
              bodyClass="card-body p-3"
            >
              <div
                className="position-absolute top-0 end-0 m-3 price-badge rounded-3 px-3 py-2 bg-white bg-opacity-90 border"
                style={{ zIndex: 5 }}
              >
                <div className="text-end">
                  <small className="text-muted">From</small>
                  <div className="fw-bold">${destination.price}</div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="h5 mb-1">{destination.name}</h3>
                  <p className="mb-2 text-muted small">{destination.country}</p>
                  <RatingStars rating={destination.rating} />
                </div>

                <div className="text-end">
                  <div className="mb-2">
                    <span className="badge bg-primary">Popular</span>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">
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
        ))}
      </div>
    </div>
  );
};

export default BeautifulDestinationCard;
