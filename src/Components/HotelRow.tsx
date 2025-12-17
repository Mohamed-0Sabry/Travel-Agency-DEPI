import React from 'react';


const HotelRow = ({ hotel, onDelete, onUpdate }) => {
  return (
    <tr>
      <td>
        <img 
          src={hotel.hotelLogo ? `http://localhost:5000/api/uploads/${hotel.hotelLogo}` : 'https://via.placeholder.com/80x60'} 
          alt={hotel.hotelName}
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
          <i className="ri-star-fill text-warning me-1"></i>
          <span>{hotel.rating?.toFixed(1) || '0.0'}</span>
        </div>
      </td>
      <td>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onUpdate(hotel)}
            title="Edit Hotel"
          >
            <i className="ri-edit-line me-1"></i>
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(hotel._id)}
            title="Delete Hotel"
          >
            <i className="ri-delete-bin-line me-1"></i>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HotelRow;