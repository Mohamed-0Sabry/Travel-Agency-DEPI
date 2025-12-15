/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import FlightRow from '../FlightRow';
import AddFlightModal from './AddFlightModal';
import UpdateFlightModal from './UpdateFlightModal';
import apiClient from "@/networks/Api/client";

interface FlightsTabProps {
  flights: any[];
  handleDeleteFlight: (id: string) => void;
  onFlightAdded: () => Promise<void>;
}

const FlightsTab: React.FC<FlightsTabProps> = ({ 
  flights, 
  handleDeleteFlight,
  onFlightAdded 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const handleAddSuccess = async () => {
    if (onFlightAdded) {
      await onFlightAdded();
    }
  };

  const handleUpdateSuccess = async () => {
    if (onFlightAdded) {
      await onFlightAdded();
    }
  };

  const handleUpdateClick = (flight: any) => {
    setSelectedFlight(flight);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedFlight(null);
  };

  const handleToggleOffer = async (flightId: string, currentOffer: any) => {
    try {
      const newStatus = !currentOffer?.isActive;
      
      const payload: any = {
        isActive: newStatus
      };
      
      if (newStatus && currentOffer) {
        if (currentOffer.oldPrice) payload.oldPrice = currentOffer.oldPrice;
        if (currentOffer.newPrice) payload.newPrice = currentOffer.newPrice;
        if (currentOffer.badge) payload.badge = currentOffer.badge;
      }
      
      await apiClient.flights.toggleOffer(flightId, payload);
      
      await onFlightAdded();
      
      const message = newStatus ? "Offer activated successfully!" : "Offer deactivated successfully!";
      alert(message);
    } catch (error: any) {
      console.error("Error toggling offer:", error);
      alert(error.response?.data?.message || "Failed to toggle offer");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Flights ({flights.length})</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
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
                <th style={{ width: '280px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <FlightRow 
                  key={flight._id} 
                  flight={flight}
                  onToggleOffer={handleToggleOffer}
                  onDelete={handleDeleteFlight}
                  onUpdate={handleUpdateClick}
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

      <AddFlightModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedFlight && (
        <UpdateFlightModal
          show={showUpdateModal}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
          flight={selectedFlight}
        />
      )}
    </>
  );
};

export default FlightsTab;