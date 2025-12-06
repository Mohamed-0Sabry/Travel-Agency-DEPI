import React from 'react';
import HotelRow from '../HotelRow';

const HotelsTab = ({ hotels, handleDeleteHotel }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Hotels ({hotels.length})</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => alert('Add hotel form coming soon!')}
        >
          <i className="ri-add-line me-2"></i>Add New Hotel
        </button>
      </div>

      <div className="recent-bookings-card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name & Location</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <HotelRow 
                  key={hotel._id} 
                  hotel={hotel}
                  onDelete={handleDeleteHotel}
                />
              ))}
            </tbody>
          </table>
          {hotels.length === 0 && (
            <div className="text-center py-5">
              <i className="ri-hotel-line" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
              <p className="text-muted mt-3">No hotels available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HotelsTab;