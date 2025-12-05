import { useState, useEffect } from "react";
import "@/styles/account.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import type { UpdateProfileData, Booking, Flight, Hotel, PaymentMethod, AddPaymentMethodData, BillingAddress } from "@/types/api.types";

// Helper function to format date
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
};

// Helper function to format date for input (YYYY-MM-DD)
const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

// Helper function to format date for display
const formatDateDisplay = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Helper function to calculate number of nights
const calculateNights = (checkIn: Date | string, checkOut: Date | string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

type HistoryMeta = { label: string; value: string };
type HistoryItem = {
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

// Transform flight booking to HistoryItem
const transformFlightBooking = (booking: Booking): HistoryItem => {
  const flight = booking.flight as Flight;
  const flightDetails = booking.flightDetails;
  const defaultLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_Logo.svg/120px-United_Airlines_Logo.svg.png";
  
  const origin = flightDetails?.origin || flight?.origin;
  const destination = flightDetails?.destination || flight?.destination;
  const route = `${origin?.city || "N/A"} → ${destination?.city || "N/A"}`;
  
  const handleDownloadTicket = () => {
    if (booking.ticketUrl) {
      window.open(booking.ticketUrl, "_blank");
    } else {
      alert("Ticket not available yet. Please contact support.");
    }
  };

  const handleViewDetails = () => {
    // Could navigate to booking details page or show modal
    alert(`Booking Reference: ${booking.bookingReference}\nStatus: ${booking.status}\nTotal Price: $${booking.totalPrice.toFixed(2)}`);
  };
  
  return {
    id: booking._id || booking.bookingReference,
    bookingId: booking._id,
    logo: flight?.image || defaultLogo,
    logoAlt: `${origin?.city} to ${destination?.city}`,
    title: booking.bookingReference,
    subtitle: route,
    ticketUrl: booking.ticketUrl,
    meta: [
      { label: "Date", value: formatDateDisplay(booking.createdAt) },
      { label: "Passengers", value: `${flightDetails?.passengers || 1} ${flightDetails?.passengers === 1 ? "Passenger" : "Passengers"}` },
      { label: "Class", value: flightDetails?.travelClass || "Economy" },
      { label: "Status", value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
      { label: "Price", value: `$${booking.totalPrice.toFixed(2)}` },
    ],
    primaryAction: booking.ticketUrl 
      ? { label: "Download Ticket", icon: "fas fa-download", onClick: handleDownloadTicket }
      : booking.status === "confirmed" || booking.status === "completed"
      ? { label: "View Details", icon: "fas fa-eye", onClick: handleViewDetails }
      : undefined,
    secondaryActionIcon: "fas fa-chevron-right",
  };
};

// Transform hotel booking to HistoryItem
const transformHotelBooking = (booking: Booking): HistoryItem => {
  const hotel = booking.hotel as Hotel;
  const hotelDetails = booking.hotelDetails;
  const defaultLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Star_logo.svg/120px-Star_logo.svg.png";
  
  const hotelName = hotelDetails?.hotelName || hotel?.hotelName || "Hotel";
  const nights = hotelDetails?.numberOfNights || (hotelDetails?.checkInDate && hotelDetails?.checkOutDate 
    ? calculateNights(hotelDetails.checkInDate, hotelDetails.checkOutDate)
    : 0);
  const roomType = hotelDetails?.roomType || "Room";

  const handleDownloadInvoice = () => {
    if (booking.confirmationUrl) {
      window.open(booking.confirmationUrl, "_blank");
    } else {
      alert("Invoice not available yet. Please contact support.");
    }
  };

  const handleViewDetails = () => {
    // Could navigate to booking details page or show modal
    alert(`Booking Reference: ${booking.bookingReference}\nStatus: ${booking.status}\nTotal Price: $${booking.totalPrice.toFixed(2)}`);
  };
  
  return {
    id: booking._id || booking.bookingReference,
    bookingId: booking._id,
    logo: hotelDetails?.hotelLogo || hotel?.hotelLogo || defaultLogo,
    logoAlt: hotelName,
    title: hotelName,
    subtitle: `${nights} ${nights === 1 ? "night" : "nights"}, ${roomType}`,
    confirmationUrl: booking.confirmationUrl,
    meta: [
      { label: "Check-in", value: formatDateDisplay(hotelDetails?.checkInDate) },
      { label: "Check-out", value: formatDateDisplay(hotelDetails?.checkOutDate) },
      { label: "Guests", value: `${hotelDetails?.numberOfGuests || 1} ${hotelDetails?.numberOfGuests === 1 ? "Guest" : "Guests"}` },
      { label: "Status", value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
      { label: "Price", value: `$${booking.totalPrice.toFixed(2)}` },
    ],
    primaryAction: booking.confirmationUrl
      ? { label: "Download Invoice", icon: "fas fa-file-download", onClick: handleDownloadInvoice }
      : booking.status === "confirmed" || booking.status === "completed"
      ? { label: "View Details", icon: "fas fa-eye", onClick: handleViewDetails }
      : undefined,
  };
};

type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
  ccv?: string; // Optional since we don't store CCV for security
  isDefault?: boolean;
  paymentMethod?: PaymentMethod; // Keep reference to original
};

// Transform PaymentMethod to display format
const transformPaymentMethod = (paymentMethod: PaymentMethod): PaymentCard => {
  // Format expiry date from YYYY-MM to MM/YY
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

  // Map cardType to brand name
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
    paymentMethod: paymentMethod, // Keep reference to original
  };
};

const ACCOUNT_TABS = [
  { id: "account", label: "Account" },
  { id: "history", label: "History" },
  { id: "payment", label: "Payment methods" },
];

function ProfileHeader() {
  const { user } = useAuthStore();
  const defaultAvatar = "src/assets/images/user-profile-icon-free-vector.jpg";

  return (
    <header className="profile-header">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="profile-info">
              <div className="avatar-container">
                <img 
                  src={user?.avatarUrl || defaultAvatar} 
                  alt={user?.name || "User"} 
                  className="profile-avatar" 
                />
                {user?.hasPhoneVerified && (
                  <span className="status-indicator" aria-label="Verified contact">
                    <i className="fas fa-phone text-white" aria-hidden="true" />
                  </span>
                )}
              </div>
              <h1 className="profile-name">{user?.name || "User"}</h1>
              <p className="profile-email">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AccountDetails() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setError(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setError(null);
  };

  const handleSave = async (field: string) => {
    try {
      setError(null);
      const updateData: UpdateProfileData = {};
      
      if (field === "Name") {
        updateData.name = editValue;
      } else if (field === "Phone number") {
        updateData.phoneNumber = editValue;
      } else if (field === "Address") {
        updateData.address = editValue;
      } else if (field === "Date of birth") {
        updateData.dateOfBirth = editValue;
      }

      await updateProfile(updateData);
      setEditingField(null);
      setEditValue("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const accountFields = [
    { 
      label: "Name", 
      value: user?.name || "Not set", 
      fieldKey: "name",
      editable: true 
    },
    { 
      label: "Email", 
      value: user?.email || "Not set", 
      fieldKey: "email",
      editable: false 
    },
    { 
      label: "Password", 
      value: "••••••••••••", 
      fieldKey: "password",
      secure: true,
      editable: false 
    },
    { 
      label: "Phone number", 
      value: user?.phoneNumber || "Not set", 
      fieldKey: "phoneNumber",
      editable: true 
    },
    { 
      label: "Address", 
      value: user?.address || "Not set", 
      fieldKey: "address",
      editable: true 
    },
    { 
      label: "Date of birth", 
      value: formatDate(user?.dateOfBirth), 
      fieldKey: "dateOfBirth",
      editable: true 
    },
  ];

  return (
    <section className="account-content">
      <h2 className="section-title">Account</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {accountFields.map(({ label, value, secure, editable, fieldKey }) => (
        <div className="field-group" key={label}>
          <div className="row align-items-center g-3 g-md-0">
            <div className="col-md-8">
              <div className="field-label">{label}</div>
              {editingField === label ? (
                <div className="mt-2">
                  {fieldKey === "dateOfBirth" ? (
                    <input
                      type="date"
                      className="form-control"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )}
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleSave(label)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="field-value">{value}</div>
                  {secure && <small className="text-muted">Last updated 3 months ago</small>}
                </>
              )}
            </div>
            <div className="col-md-4 text-md-end">
              {editable && !editingField && (
                <button
                  className="btn edit-btn"
                  type="button"
                  onClick={() => handleEdit(label, fieldKey === "dateOfBirth" ? formatDateForInput(user?.dateOfBirth) : (user as any)?.[fieldKey] || "")}
                >
                  <i className="fas fa-edit" aria-hidden="true" /> Edit
                </button>
              )}
              {!editable && label === "Password" && (
                <button
                  className="btn edit-btn"
                  type="button"
                  onClick={() => alert("Password change feature coming soon!")}
                >
                  <i className="fas fa-edit" aria-hidden="true" /> Change
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function HistorySection({
  title,
  icon,
  items,
  actionLabel,
}: {
  title: string;
  icon: string;
  items: HistoryItem[];
  actionLabel?: string;
}) {
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          <i className={`${icon} me-2`} aria-hidden="true" />
          {title}
        </h3>
        {actionLabel ? (
          <button className="btn btn-outline-primary btn-sm" type="button">
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="row g-3">
        {items.map((item) => (
          <div className="col-12" key={item.id}>
            <article className="history-card">
              <div className="row align-items-center g-3">
                <div className="col-lg-1 col-md-2 col-3 text-center">
                  <img src={item.logo} alt={item.logoAlt} className="airline-logo" />
                </div>
                <div className="col-lg-2 col-md-4 col-9">
                  <strong className="d-block">{item.title}</strong>
                  <small className="text-muted">{item.subtitle}</small>
                </div>
                <div className="col-lg-5 col-md-4 col-12">
                  <div className="row gy-2">
                    {item.meta.map((meta) => (
                      <div className="col-sm-6 col-12" key={`${item.id}-${meta.label}`}>
                        <div>
                          <strong>{meta.label}:</strong> {meta.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {item.primaryAction ? (
                  <div className="col-lg-3 col-md-6 col-12">
                    <button 
                      className="btn download-btn w-100" 
                      type="button"
                      onClick={item.primaryAction.onClick}
                    >
                      {item.primaryAction.icon ? (
                        <i className={`${item.primaryAction.icon} me-2`} aria-hidden="true" />
                      ) : null}
                      {item.primaryAction.label}
                    </button>
                  </div>
                ) : null}
                {item.secondaryActionIcon ? (
                  <div className="col-lg-1 d-none d-lg-block text-end">
                    <button className="btn btn-outline-secondary" type="button" aria-label="View details">
                      <i className={item.secondaryActionIcon} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

function PaymentMethods() {
  const { paymentMethods, isLoading, error, getPaymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = usePaymentStore();
  const { isAuthenticated } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<AddPaymentMethodData>({
    cardType: "VISA",
    lastFourDigits: "",
    cardholderName: "",
    expiryDate: "",
    isDefault: false,
    billingAddress: {
      street: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getPaymentMethods().catch((err) => {
        console.error("Failed to fetch payment methods:", err);
      });
    }
  }, [isAuthenticated, getPaymentMethods]);

  const handleAddCard = () => {
    setShowAddModal(true);
    setFormError(null);
    setFormData({
      cardType: "VISA",
      lastFourDigits: "",
      cardholderName: "",
      expiryDate: "",
      isDefault: paymentMethods.length === 0, // Set as default if first card
      billingAddress: {
        street: "",
        city: "",
        country: "",
        postalCode: "",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4) {
      setFormError("Last 4 digits must be exactly 4 digits");
      return;
    }
    if (!formData.cardholderName.trim()) {
      setFormError("Cardholder name is required");
      return;
    }
    if (!formData.expiryDate) {
      setFormError("Expiry date is required");
      return;
    }
    if (!formData.billingAddress.street || !formData.billingAddress.city || !formData.billingAddress.country || !formData.billingAddress.postalCode) {
      setFormError("All billing address fields are required");
      return;
    }

    try {
      await addPaymentMethod(formData);
      setShowAddModal(false);
      setFormError(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to add payment method");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      try {
        await deletePaymentMethod(id);
      } catch (err) {
        console.error("Failed to delete payment method:", err);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
    } catch (err) {
      console.error("Failed to set default payment method:", err);
    }
  };

  const transformedCards = paymentMethods.map(transformPaymentMethod);

  if (isLoading && paymentMethods.length === 0) {
    return (
      <section className="account-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Payment Methods</h2>
        <button className="btn btn-primary" type="button" onClick={handleAddCard}>
          <i className="fas fa-plus me-2" aria-hidden="true" />
          Add New Card
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {transformedCards.map((card) => (
          <div className="col-lg-4 col-md-6" key={card.id}>
            <div className="card payment-card h-100">
              <div className="card-body position-relative p-4">
                <button
                  className="delete-card-btn"
                  title="Delete card"
                  type="button"
                  onClick={() => handleDelete(card.id)}
                  disabled={isLoading}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-light text-dark text-uppercase fw-semibold">
                    {card.isDefault ? "Primary" : "Backup"}
                  </span>
                  <span className="fw-semibold">{card.brand}</span>
                </div>
                <div className="mb-4">
                  <h5 className="card-number mb-0">**** **** **** {card.last4}</h5>
                </div>
                <div className="mb-3">
                  <small className="text-white-50 d-block">Cardholder Name</small>
                  <div className="fw-semibold">{card.holder}</div>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <small className="text-white-50 d-block">Expires</small>
                    <div className="fw-semibold">{card.expiry}</div>
                  </div>
                  {!card.isDefault && (
                    <div className="text-end">
                      <button
                        className="btn btn-sm btn-outline-light"
                        type="button"
                        onClick={() => handleSetDefault(card.id)}
                        disabled={isLoading}
                      >
                        <i className="fas fa-star me-1" aria-hidden="true" />
                        Set Primary
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-lg-4 col-md-6">
          <div className="card add-card h-100 d-flex align-items-center justify-content-center">
            <div className="text-center p-4">
              <button
                className="btn btn-outline-primary rounded-circle mb-3"
                type="button"
                style={{ width: 60, height: 60 }}
                onClick={handleAddCard}
              >
                <i className="fas fa-plus fa-lg" aria-hidden="true" />
              </button>
              <h5 className="mb-2">Add New Card</h5>
              <p className="text-muted mb-0">Add another payment method to your account</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100" style={{ border: "2px solid #0070ba", borderRadius: 15 }}>
            <div className="card-body d-flex align-items-center justify-content-center text-center p-4">
              <div>
                <i className="fab fa-paypal fa-3x text-primary mb-3" aria-hidden="true" />
                <h5 className="mb-2">PayPal</h5>
                <p className="text-muted mb-3">Link your PayPal account and pay securely</p>
                <button className="btn btn-outline-primary" type="button">
                  Connect PayPal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {paymentMethods.length === 0 && !isLoading && (
        <div className="text-center py-5">
          <i className="fas fa-credit-card fa-3x text-muted mb-3" aria-hidden="true" />
          <p className="text-muted">You don't have any payment methods yet. Add one to get started!</p>
        </div>
      )}

      <div className="mt-5">
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <i className="fas fa-shield-alt fa-2x me-3" aria-hidden="true" />
          <div>
            <h6 className="mb-1">Your payment information is secure</h6>
            <small>
              We use industry-standard encryption to protect your payment data. Your card details are never stored on our
              servers.
            </small>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Payment Method</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Card Type</label>
                    <select
                      className="form-select"
                      value={formData.cardType}
                      onChange={(e) => setFormData({ ...formData, cardType: e.target.value as "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER" })}
                      required
                    >
                      <option value="VISA">VISA</option>
                      <option value="MASTERCARD">Mastercard</option>
                      <option value="AMEX">American Express</option>
                      <option value="DISCOVER">Discover</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last 4 Digits</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={formData.lastFourDigits}
                      onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value.replace(/\D/g, "") })}
                      placeholder="1234"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Billing Address - Street</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.billingAddress.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, street: e.target.value },
                        })
                      }
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.billingAddress.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billingAddress: { ...formData.billingAddress, city: e.target.value },
                          })
                        }
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.billingAddress.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billingAddress: { ...formData.billingAddress, postalCode: e.target.value },
                          })
                        }
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.billingAddress.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, country: e.target.value },
                        })
                      }
                      placeholder="United States"
                      required
                    />
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      id="setAsDefault"
                    />
                    <label className="form-check-label" htmlFor="setAsDefault">
                      Set as primary payment method
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Card"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function HistoryTab() {
  const { bookings, isLoading, error, getMyBookings } = useBookingStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getMyBookings().catch((err) => {
        console.error("Failed to fetch bookings:", err);
      });
    }
  }, [isAuthenticated, getMyBookings]);

  // Separate flight and hotel bookings
  const flightBookings = bookings
    .filter((booking) => booking.bookingType === "flight")
    .map(transformFlightBooking);

  const hotelBookings = bookings
    .filter((booking) => booking.bookingType === "hotel")
    .map(transformHotelBooking);

  if (isLoading) {
    return (
      <section className="account-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
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
        <HistorySection title="Flights" icon="fas fa-plane" items={flightBookings} />
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
        <HistorySection title="Hotels" icon="fas fa-hotel" items={hotelBookings} />
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
          <i className="fas fa-calendar-times fa-3x text-muted mb-3" aria-hidden="true" />
          <p className="text-muted">You don't have any bookings yet.</p>
        </div>
      )}
    </section>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<string>(ACCOUNT_TABS[0].id);
  const { user, getCurrentUser, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch user data if authenticated but user data is not loaded
    if (isAuthenticated && !user) {
      getCurrentUser().catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
    }
  }, [isAuthenticated, user, getCurrentUser]);

  if (isLoading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Please log in to view your account information.
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader />

      <div className="account-container container mt-4">
        <ul className="nav nav-tabs custom-tabs" role="tablist">
          {ACCOUNT_TABS.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                id={`${tab.id}-tab`}
                type="button"
                role="tab"
                aria-controls={`${tab.id}-panel`}
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div
            id="account-panel"
            className={`tab-pane fade ${activeTab === "account" ? "show active" : ""}`}
            role="tabpanel"
            aria-labelledby="account-tab"
          >
            {activeTab === "account" ? <AccountDetails /> : null}
          </div>

          <div
            id="history-panel"
            className={`tab-pane fade ${activeTab === "history" ? "show active" : ""}`}
            role="tabpanel"
            aria-labelledby="history-tab"
          >
            {activeTab === "history" ? <HistoryTab /> : null}
          </div>

          <div
            id="payment-panel"
            className={`tab-pane fade ${activeTab === "payment" ? "show active" : ""}`}
            role="tabpanel"
            aria-labelledby="payment-tab"
          >
            {activeTab === "payment" ? <PaymentMethods /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
