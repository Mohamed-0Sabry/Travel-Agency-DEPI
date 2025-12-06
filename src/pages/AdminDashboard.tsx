import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import useFlightStore from '@/store/useFlightStore';
import { useHotelStore } from '@/store/useHotelStore';
import apiClient from '@/networks/Api/client';
import "@/styles/adminPage.css";

import Sidebar from '@/Components/AdminPageComponents/Sidebar';
import OverviewTab from '@/Components/AdminPageComponents/OverviewTab';
import BookingsTab from '@/Components/AdminPageComponents/BookingsTab';
import FlightsTab from '@/Components/AdminPageComponents/FlightsTab';
import HotelsTab from '@/Components/AdminPageComponents/HotelsTab';
import UsersTab from '@/Components/AdminPageComponents/UsersTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeFlights: 0,
    activeHotels: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalUsers: 0,
  });
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingFilters, setBookingFilters] = useState({ status: 'all' });

  const { user } = useAuthStore();
  const { flights, fetchFlights, deleteFlight } = useFlightStore();
  const { hotels, getHotels } = useHotelStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      document.body.classList.add('admin-page');
      loadDashboardData();
    }
    
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAllBookings(),
        fetchFlights(),
        getHotels(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await apiClient.bookings.getAllBookings();
      setAllBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      setAllBookings([]);
    }
  };

  useEffect(() => {
    if (allBookings.length > 0 || flights.length > 0 || hotels.length > 0) {
      calculateStats();
    }
  }, [allBookings, flights, hotels]);

  const calculateStats = () => {
    const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const completedBookings = allBookings.filter(b => b.status === 'completed').length;
    const uniqueUsers = new Set(allBookings.map(b => b.user?._id || b.user)).size;

    setStats({
      totalBookings: allBookings.length,
      totalRevenue,
      activeFlights: flights.length,
      activeHotels: hotels.length,
      pendingBookings,
      completedBookings,
      totalUsers: uniqueUsers,
    });
  };

  const handleDeleteFlight = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await deleteFlight(flightId);
        await fetchFlights();
        alert('Flight deleted successfully');
      } catch (error) {
        console.error('Error deleting flight:', error);
        alert('Failed to delete flight');
      }
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        console.log(hotelId);
        await getHotels();
        alert('Hotel deleted successfully');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('Failed to delete hotel');
      }
    }
  };

  const handleToggleOffer = async (flightId, currentOffer) => {
    try {
      await apiClient.flights.toggleOffer(flightId, {
        isActive: !currentOffer?.isActive
      });
      await fetchFlights();
      alert('Offer status updated');
    } catch (error) {
      console.error('Error toggling offer:', error);
      alert('Failed to update offer');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="ri-error-warning-line me-2"></i>
          Access Denied: Admin privileges required
        </div>
      </div>
    );
  }

  const filteredBookings = bookingFilters.status === 'all' 
    ? allBookings 
    : allBookings.filter(b => b.status === bookingFilters.status);

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
      />

      <button
        className={`btn btn-primary toggle-sidebar-btn ${sidebarCollapsed ? 'expanded' : ''}`}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        <i className={`ri-${sidebarCollapsed ? 'menu' : 'close'}-line`}></i>
      </button>

      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'overview' && (
          <OverviewTab 
            user={user}
            stats={stats}
            allBookings={allBookings}
            setActiveTab={setActiveTab}
          />
        )}

        {!isLoading && activeTab === 'bookings' && (
          <BookingsTab 
            filteredBookings={filteredBookings}
            bookingFilters={bookingFilters}
            setBookingFilters={setBookingFilters}
          />
        )}

        {!isLoading && activeTab === 'flights' && (
          <FlightsTab 
            flights={flights}
            handleDeleteFlight={handleDeleteFlight}
            handleToggleOffer={handleToggleOffer}
          />
        )}

        {!isLoading && activeTab === 'hotels' && (
          <HotelsTab 
            hotels={hotels}
            handleDeleteHotel={handleDeleteHotel}
          />
        )}

        {!isLoading && activeTab === 'users' && (
          <UsersTab stats={stats} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;