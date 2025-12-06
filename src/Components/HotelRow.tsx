import React from 'react';

const HotelRow = ({ hotel, onDelete }) => {
  return (
    <tr>
      <td>
        <img 
          src={'http://localhost:5000/api/uploads/Hotel-2.webp'} 
          alt={hotel.name}
          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }}
        />
      </td>
      <td>
        <strong>{hotel.hotelName || 'N/A'}</strong>
        <br />
        <small className="text-muted">
          {hotel.location?.city}, {hotel.location?.country}
        </small>
      </td>
      <td>
        <div className="d-flex align-items-center">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`ri-star-${i < (hotel.rating || 0) ? 'fill' : 'line'}`} 
              style={{ color: '#fbbf24', fontSize: '0.875rem' }}
            ></i>
          ))}
          <span className="ms-1 small text-muted">({hotel.rating || 0})</span>
        </div>
      </td>
      <td>
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(hotel._id)}
          title="Delete"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </td>
    </tr>
  );
};

export default HotelRow;