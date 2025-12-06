import React, { useEffect } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import HistorySection from "./HistorySection";
import {
  transformFlightBooking,
  transformHotelBooking,
} from "./AccountHelpers";

export default function HistoryTab() {
  const { bookings, isLoading, error, getMyBookings } = useBookingStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getMyBookings().catch((err) => {
        console.error("Failed to fetch bookings:", err);
      });
    }
  }, [isAuthenticated, getMyBookings]);

  const flightBookings = bookings
    .filter((booking) => booking.bookingType === "flight")
    .map(transformFlightBooking);

  const hotelBookings = bookings
    .filter((booking) => booking.bookingType === "hotel")
    .map(transformHotelBooking);

  if (isLoading) {
    return (
      <section className="account-content">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="account-content">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="account-content">
      {flightBookings.length > 0 ? (
        <HistorySection
          title="Flights"
          icon="fas fa-plane"
          items={flightBookings}
        />
      ) : (
        <div className="mb-5">
          <h3 className="mb-3">
            <i className="fas fa-plane me-2" aria-hidden="true" />
            Flights
          </h3>
          <div className="alert alert-info" role="alert">
            No flight bookings found. Start booking your next trip!
          </div>
        </div>
      )}

      {hotelBookings.length > 0 ? (
        <HistorySection
          title="Hotels"
          icon="fas fa-hotel"
          items={hotelBookings}
        />
      ) : (
        <div className="mb-5">
          <h3 className="mb-3">
            <i className="fas fa-hotel me-2" aria-hidden="true" />
            Hotels
          </h3>
          <div className="alert alert-info" role="alert">
            No hotel bookings found. Start booking your next stay!
          </div>
        </div>
      )}

      {bookings.length === 0 && !isLoading && (
        <div className="text-center py-5">
          <i
            className="fas fa-calendar-times fa-3x text-muted mb-3"
            aria-hidden="true"
          />
          <p className="text-muted">You don't have any bookings yet.</p>
        </div>
      )}
    </section>
  );
}
