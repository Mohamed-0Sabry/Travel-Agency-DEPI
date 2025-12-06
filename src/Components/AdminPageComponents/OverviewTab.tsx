import React from 'react';
import StatCard from '@/Components/ui/StatCard';

const OverviewTab = ({ user, stats, allBookings, setActiveTab }) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-2">
          Welcome back, <span className="text-gradient">{user?.name}</span>
        </h2>
        <p className="text-muted">Here's what's happening with your travel business today.</p>
      </div>

      <div className="row">
        <StatCard
          icon="booklet-line"
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle={`${stats.pendingBookings} pending`}
          color="primary"
        />
        <StatCard
          icon="money-euro-circle-line"
          title="Total Revenue"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          subtitle="All time"
          color="success"
        />
        <StatCard
          icon="flight-takeoff-line"
          title="Active Flights"
          value={stats.activeFlights}
          subtitle="Available routes"
          color="info"
        />
        <StatCard
          icon="hotel-line"
          title="Active Hotels"
          value={stats.activeHotels}
          subtitle="Partner properties"
          color="warning"
        />
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="recent-bookings-card">
            <div className="card-header-custom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Bookings</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setActiveTab('bookings')}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className={`booking-icon bg-${booking.type === 'flight' ? 'primary' : 'info'} bg-opacity-10 d-inline-flex`}>
                          <i className={`ri-${booking.type === 'flight' ? 'flight-takeoff' : 'hotel'}-line text-${booking.type === 'flight' ? 'primary' : 'info'}`}></i>
                        </div>
                      </td>
                      <td>{booking.user?.name || booking.user?.email || 'N/A'}</td>
                      <td>€{booking.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge bg-${booking.status === "completed" || booking.status === "confirmed"
                              ? "success"
                              : booking.status === "pending"
                                ? "warning"
                                : "danger"
                            }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allBookings.length === 0 && (
                <div className="text-center py-5">
                  <i className="ri-inbox-line" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                  <p className="text-muted mt-3">No bookings yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="stat-card mb-3">
            <h6 className="fw-bold mb-3">Quick Stats</h6>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Completed</span>
                <strong className="text-success">{stats.completedBookings}</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: `${(stats.completedBookings / stats.totalBookings * 100) || 0}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Pending</span>
                <strong className="text-warning">{stats.pendingBookings}</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${(stats.pendingBookings / stats.totalBookings * 100) || 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Users</span>
                <strong className="text-primary">{stats.totalUsers}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;