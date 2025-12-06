import type {
  Booking,
  Flight,
  Hotel,
  PaymentMethod,
} from "@/types/api.types";
import axiosInstance from "@/networks/axiosInstance";


export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const formatDateDisplay = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateNights = (
  checkIn: Date | string,
  checkOut: Date | string
): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export type HistoryMeta = { label: string; value: string };
export type HistoryItem = {
  type: "flight" | "hotel";
  id: string;
  logo: string;
  logoAlt: string;
  title: string;
  subtitle: string;
  meta: HistoryMeta[];
  primaryAction?: { label: string; icon?: string; onClick?: () => void };
  secondaryActionIcon?: string;
  bookingId?: string;
  ticketUrl?: string;
  confirmationUrl?: string;
};

export const transformFlightBooking = (booking: Booking): HistoryItem => {
  const flight = booking.flight as Flight;
  const flightDetails = booking.flightDetails;
  const base = axiosInstance.defaults.baseURL;
  const defaultLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_Logo.svg/120px-United_Airlines_Logo.svg.png";

  const origin = flightDetails?.origin || flight?.origin;
  const destination = flightDetails?.destination || flight?.destination;
  const route = `${origin?.city || "N/A"} → ${destination?.city || "N/A"}`;


  const imageUrl = flight?.image 
  ? `${base}/uploads/${flight.image.replace(/\\/g, "/")}`
  : defaultLogo;


  const handleDownloadTicket = () => {
    if (booking.ticketUrl) {
      window.open(booking.ticketUrl, "_blank");
    } else {
      alert("Ticket not available yet. Please contact support.");
    }
  };

  const handleViewDetails = () => {
    alert(
      `Booking Reference: ${booking.bookingReference}\nStatus: ${
        booking.status
      }\nTotal Price: $${booking.totalPrice.toFixed(2)}`
    );
  };

  return {
    id: booking._id || booking.bookingReference,
    bookingId: booking._id,
    type: "flight",
    logo: imageUrl,
    logoAlt: `${origin?.city} to ${destination?.city}`,
    title: booking.bookingReference,
    subtitle: route,
    ticketUrl: booking.ticketUrl,
    meta: [
      { label: "Date", value: formatDateDisplay(booking.createdAt) },
      {
        label: "Passengers",
        value: `${flightDetails?.passengers || 1} ${
          flightDetails?.passengers === 1 ? "Passenger" : "Passengers"
        }`,
      },
      { label: "Class", value: flightDetails?.travelClass || "Economy" },
      {
        label: "Status",
        value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      },
      { label: "Price", value: `$${booking.totalPrice.toFixed(2)}` },
    ],
    primaryAction: booking.ticketUrl
      ? {
          label: "Download Ticket",
          icon: "fas fa-download",
          onClick: handleDownloadTicket,
        }
      : booking.status === "confirmed" || booking.status === "completed"
      ? {
          label: "View Details",
          icon: "fas fa-eye",
          onClick: handleViewDetails,
        }
      : undefined,
    secondaryActionIcon: "fas fa-chevron-right",
  };
};

export const transformHotelBooking = (booking: Booking): HistoryItem => {
  const hotel = booking.hotel as Hotel;
  const hotelDetails = booking.hotelDetails;
  const base = axiosInstance.defaults.baseURL;
  const defaultLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Star_logo.svg/120px-Star_logo.svg.png";

  const hotelName = hotelDetails?.hotelName || hotel?.hotelName || "Hotel";
  const nights =
    hotelDetails?.numberOfNights ||
    (hotelDetails?.checkInDate && hotelDetails?.checkOutDate
      ? calculateNights(hotelDetails.checkInDate, hotelDetails.checkOutDate)
      : 0);
  const roomType = hotelDetails?.roomType || "Room";

  const hotelLogo = hotelDetails?.hotelLogo || hotel?.hotelLogo;
  const imageUrl = hotelLogo
    ? `${base}/uploads/Hotel-2.webp`
    : defaultLogo;


  const handleDownloadInvoice = () => {
    if (booking.confirmationUrl) {
      window.open(booking.confirmationUrl, "_blank");
    } else {
      alert("Invoice not available yet. Please contact support.");
    }
  };

  const handleViewDetails = () => {
    alert(
      `Booking Reference: ${booking.bookingReference}\nStatus: ${
        booking.status
      }\nTotal Price: $${booking.totalPrice.toFixed(2)}`
    );
  };

  return {
    id: booking._id || booking.bookingReference,
    bookingId: booking._id,
    type: "hotel",
    logo: imageUrl,
    logoAlt: hotelName,
    title: hotelName,
    subtitle: `${nights} ${nights === 1 ? "night" : "nights"}, ${roomType}`,
    confirmationUrl: booking.confirmationUrl,
    meta: [
      {
        label: "Check-in",
        value: formatDateDisplay(hotelDetails?.checkInDate),
      },
      {
        label: "Check-out",
        value: formatDateDisplay(hotelDetails?.checkOutDate),
      },
      {
        label: "Guests",
        value: `${hotelDetails?.numberOfGuests || 1} ${
          hotelDetails?.numberOfGuests === 1 ? "Guest" : "Guests"
        }`,
      },
      {
        label: "Status",
        value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      },
      { label: "Price", value: `$${booking.totalPrice.toFixed(2)}` },
    ],
    primaryAction: booking.confirmationUrl
      ? {
          label: "Download Invoice",
          icon: "fas fa-file-download",
          onClick: handleDownloadInvoice,
        }
      : booking.status === "confirmed" || booking.status === "completed"
      ? {
          label: "View Details",
          icon: "fas fa-eye",
          onClick: handleViewDetails,
        }
      : undefined,
  };
};

export type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
  ccv?: string;
  isDefault?: boolean;
  paymentMethod?: PaymentMethod;
};

export const transformPaymentMethod = (
  paymentMethod: PaymentMethod
): PaymentCard => {
  const formatExpiry = (expiryDate: string): string => {
    if (!expiryDate) return "N/A";
    const parts = expiryDate.split("-");
    if (parts.length >= 2) {
      const year = parts[0].slice(-2);
      const month = parts[1];
      return `${month}/${year}`;
    }
    return expiryDate;
  };

  const getBrandName = (cardType: string): string => {
    const brandMap: Record<string, string> = {
      VISA: "VISA",
      MASTERCARD: "Mastercard",
      AMEX: "American Express",
      DISCOVER: "Discover",
    };
    return brandMap[cardType] || cardType;
  };

  return {
    id: paymentMethod._id,
    brand: getBrandName(paymentMethod.cardType),
    last4: paymentMethod.lastFourDigits,
    holder: paymentMethod.cardholderName,
    expiry: formatExpiry(paymentMethod.expiryDate),
    isDefault: paymentMethod.isDefault,
    paymentMethod: paymentMethod,
  };
};
