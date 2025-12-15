import React from 'react';


const FlightRow = ({ flight, onToggleOffer, onDelete, onUpdate }) => {
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
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onUpdate(flight)}
            title="Edit Flight"
          >
            <i className="ri-edit-line me-1"></i>
            Edit
          </button>
          <button 
            className="btn btn-sm btn-warning"
            onClick={() => onToggleOffer(flight._id, flight.offer)}
            title="Toggle Offer"
          >
            <i className="ri-price-tag-3-line me-1"></i>
            Offer
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(flight._id)}
            title="Delete Flight"
          >
            <i className="ri-delete-bin-line me-1"></i>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FlightRow;