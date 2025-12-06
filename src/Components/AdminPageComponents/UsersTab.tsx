const UsersTab = ({ stats }) => {
  return (
    <>
      <h2 className="fw-bold mb-4">Users Management</h2>
      <div className="stat-card">
        <div className="text-center py-5">
          <i className="ri-user-line" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
          <p className="text-muted mt-3">Total Registered Users: {stats.totalUsers}</p>
          <p className="text-muted">User management interface coming soon</p>
        </div>
      </div>
    </>
  );
};

export default UsersTab;