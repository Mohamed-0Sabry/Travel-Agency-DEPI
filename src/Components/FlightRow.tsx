import React from 'react';

const FlightRow = ({ flight, onToggleOffer, onDelete }) => {
  return (
    <tr>
      <td>
        <img 
          src={flight.image ? `http://localhost:5000/api/uploads/${flight.image}` : 'https://via.placeholder.com/80x60'} 
          alt={flight.destination?.city}
          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }}
        />
      </td>
      <td>
        <strong>{flight.origin?.city || 'N/A'}</strong>
        <br />
        <small className="text-muted">{flight.origin?.country}</small>
      </td>
      <td>
        <strong>{flight.destination?.city || 'N/A'}</strong>
        <br />
        <small className="text-muted">{flight.destination?.country}</small>
      </td>
      <td>€{flight.price?.toFixed(2) || '0.00'}</td>
      <td>
        {flight.offer?.isActive ? (
          <span className="badge bg-success">Active Offer</span>
        ) : (
          <span className="badge bg-secondary">No Offer</span>
        )}
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => onToggleOffer(flight._id, flight.offer)}
            title="Toggle Offer"
          >
            <i className="ri-price-tag-3-line"></i>
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(flight._id)}
            title="Delete"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FlightRow;