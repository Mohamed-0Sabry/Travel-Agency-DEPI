import React from 'react';

const BookingRow = ({ booking }) => {
  const isFlight = booking.bookingType === "flight";
  const isHotel = booking.bookingType === "hotel";

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <div
            className={`booking-icon me-2 bg-${isFlight ? "primary" : "info"} bg-opacity-10`}
          >
            <i
              className={`ri-${isFlight ? "flight-takeoff" : "hotel"}-line text-${
                isFlight ? "primary" : "info"
              }`}
            ></i>
          </div>

          <div>
            <strong>{isFlight ? "Flight" : "Hotel"}</strong>
            <br />
            <small className="text-muted">
              {isHotel
                ? booking.hotelDetails?.hotelName
                : `Class: ${booking.flightDetails?.travelClass || "N/A"}`}
            </small>
          </div>
        </div>
      </td>

      <td>
        {booking.user?.name || booking.user?.email || "N/A"}
        <br />
        <small className="text-muted">{booking.user?.email}</small>
      </td>

      <td>€{Number(booking.totalPrice).toFixed(2)}</td>

      <td>
        <span
          className={`badge bg-${
            booking.status === "completed"
              ? "success"
              : booking.status === "pending"
              ? "warning"
              : booking.status === "cancelled"
              ? "danger"
              : "secondary"
          }`}
        >
          {booking.status}
        </span>
      </td>

      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};

export default BookingRow;