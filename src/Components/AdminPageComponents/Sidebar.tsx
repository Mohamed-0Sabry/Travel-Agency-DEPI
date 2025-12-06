import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, sidebarCollapsed }) => {
  const navItems = [
    { id: 'overview', icon: 'dashboard-line', label: 'Overview' },
    { id: 'bookings', icon: 'calendar-check-line', label: 'All Bookings' },
    { id: 'flights', icon: 'flight-takeoff-line', label: 'Manage Flights' },
    { id: 'hotels', icon: 'hotel-line', label: 'Manage Hotels' },
    { id: 'users', icon: 'user-line', label: 'Users' },
  ];

  return (
    <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <NavLink to='/'>
          <h4 className="fw-bold mb-1">
            <span className="text-gradient">Phnes Admin</span>
          </h4>
        </NavLink>
        <p className="text-muted small mb-0">Travel Management System</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`ri-${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;