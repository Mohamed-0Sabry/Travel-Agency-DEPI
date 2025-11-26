import React from "react";

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

export default RatingStars;