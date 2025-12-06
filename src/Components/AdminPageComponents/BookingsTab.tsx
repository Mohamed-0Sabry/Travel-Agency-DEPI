import React from 'react';
import BookingRow from '../BookingRow';

const BookingsTab = ({ filteredBookings, bookingFilters, setBookingFilters }) => {
  const filterButtons = [
    { status: 'all', label: 'All' },
    { status: 'pending', label: 'Pending' },
    { status: 'completed', label: 'Completed' },
    { status: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">All Bookings</h2>
        <div className="btn-group">
          {filterButtons.map((filter) => (
            <button
              key={filter.status}
              className={`btn btn-sm ${
                bookingFilters.status === filter.status
                  ? 'btn-primary'
                  : 'btn-outline-primary'
              }`}
              onClick={() => setBookingFilters({ status: filter.status })}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="recent-bookings-card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Booking Type</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-5">
              <i className="ri-inbox-line" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
              <p className="text-muted mt-3">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsTab;