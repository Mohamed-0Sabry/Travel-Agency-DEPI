/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import HotelRow from '../HotelRow';
import AddHotelModal from './AddHotelModal';
import UpdateHotelModal from './UpdateHotelModal';

interface HotelsTabProps {
  hotels: any[];
  handleDeleteHotel: (id: string) => void;
  onHotelAdded: () => Promise<void>;
}

const HotelsTab: React.FC<HotelsTabProps> = ({ 
  hotels, 
  handleDeleteHotel, 
  onHotelAdded 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const handleAddSuccess = async () => {
    if (onHotelAdded) {
      await onHotelAdded();
    }
  };

  const handleUpdateSuccess = async () => {
    if (onHotelAdded) {
      await onHotelAdded();
    }
  };

  const handleUpdateClick = (hotel: any) => {
    setSelectedHotel(hotel);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedHotel(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Hotels ({hotels.length})</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
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
                <th style={{ width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <HotelRow 
                  key={hotel._id} 
                  hotel={hotel}
                  onDelete={handleDeleteHotel}
                  onUpdate={handleUpdateClick}
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

      <AddHotelModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedHotel && (
        <UpdateHotelModal
          show={showUpdateModal}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
          hotel={selectedHotel}
        />
      )}
    </>
  );
};

export default HotelsTab;