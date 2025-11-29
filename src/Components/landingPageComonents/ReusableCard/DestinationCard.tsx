import React from "react";
import "../../../styles/DestinationCard.css";

export interface DestinationCardProps {
  image: string;
  title: string;
  location?: string;
  description?: string;
  price?: string;
  rating?: number;
  buttonLabel?: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  location,
  description,
  price,
  rating,
  buttonLabel,
}) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-img-top" />

      <div className="card-body">
        <h5 className="destination-title">{title}</h5>

        {location && (
          <p className="destination-location">
            <i className="ri-map-pin-line"></i> {location}
          </p>
        )}

        {rating && (
          <div className="card-rating">
            {[...Array(rating)].map((_, i) => (
              <i key={i} className="ri-star-fill"></i>
            ))}
          </div>
        )}

        {description && <p className="card-text">{description}</p>}

        {price && (
          <div className="card-footer">
            <div className="price">
              From <span>{price}</span>
            </div>
            <button className="btn-details">{buttonLabel || "DETAILS"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
