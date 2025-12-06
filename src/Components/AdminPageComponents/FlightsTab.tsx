import React from 'react';
import FlightRow from '../FlightRow';

const FlightsTab = ({ flights, handleDeleteFlight, handleToggleOffer }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Flights ({flights.length})</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => alert('Add flight form coming soon!')}
        >
          <i className="ri-add-line me-2"></i>Add New Flight
        </button>
      </div>

      <div className="recent-bookings-card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Offer Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <FlightRow 
                  key={flight._id} 
                  flight={flight}
                  onToggleOffer={handleToggleOffer}
                  onDelete={handleDeleteFlight}
                />
              ))}
            </tbody>
          </table>
          {flights.length === 0 && (
            <div className="text-center py-5">
              <i className="ri-flight-takeoff-line" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
              <p className="text-muted mt-3">No flights available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FlightsTab;