import React from 'react';

const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="stat-card h-100">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <p className="text-muted mb-2 small">{title}</p>
            <h3 className="fw-bold mb-1">{value}</h3>
            {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
          </div>
          <div className={`stat-icon bg-${color} bg-opacity-10`}>
            <i className={`ri-${icon} text-${color}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;