import { useState, useEffect } from "react";
import "@/styles/account.css";
import { useAuthStore } from "@/store/useAuthStore";
import type { UpdateProfileData } from "@/types/api.types";

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

type HistoryMeta = { label: string; value: string };
type HistoryItem = {
  id: string;
  logo: string;
  logoAlt: string;
  title: string;
  subtitle: string;
  meta: HistoryMeta[];
  primaryAction?: { label: string; icon?: string };
  secondaryActionIcon?: string;
};

const FLIGHT_HISTORY: HistoryItem[] = [
  {
    id: "IN230",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_Logo.svg/120px-United_Airlines_Logo.svg.png",
    logoAlt: "United Airlines",
    title: "IN 230",
    subtitle: "11:00 PM – 6:00 AM",
    meta: [
      { label: "Date", value: "Dec 11, 2022" },
      { label: "Flight time", value: "7h 40min" },
      { label: "Gate", value: "2B" },
      { label: "Seat", value: "22" },
    ],
    primaryAction: { label: "Download Ticket", icon: "fas fa-download" },
    secondaryActionIcon: "fas fa-chevron-right",
  },
  {
    id: "AT992",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qatar_Airways_Logo.svg/120px-Qatar_Airways_Logo.svg.png",
    logoAlt: "Qatar Airways",
    title: "AT 992",
    subtitle: "02:30 PM – 8:10 PM",
    meta: [
      { label: "Date", value: "Aug 04, 2023" },
      { label: "Flight time", value: "5h 40min" },
      { label: "Gate", value: "C4" },
      { label: "Seat", value: "14A" },
    ],
    primaryAction: { label: "View Receipt", icon: "fas fa-file-invoice" },
    secondaryActionIcon: "fas fa-chevron-right",
  },
];

const HOTEL_HISTORY: HistoryItem[] = [
  {
    id: "hotel-royal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Star_logo.svg/120px-Star_logo.svg.png",
    logoAlt: "Royal Palace",
    title: "Royal Palace Hotel",
    subtitle: "3 nights, Deluxe Suite",
    meta: [
      { label: "Check-in", value: "Jan 15, 2024" },
      { label: "Check-out", value: "Jan 18, 2024" },
      { label: "Guests", value: "2 Adults" },
    ],
    primaryAction: { label: "Download Invoice", icon: "fas fa-file-download" },
  },
  {
    id: "hotel-seaview",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/HiltonHotelsLogo.svg/120px-HiltonHotelsLogo.svg.png",
    logoAlt: "Sea View Resort",
    title: "Sea View Resort & Spa",
    subtitle: "5 nights, Oceanfront Room",
    meta: [
      { label: "Check-in", value: "Nov 02, 2023" },
      { label: "Check-out", value: "Nov 07, 2023" },
      { label: "Guests", value: "2 Adults, 1 Child" },
    ],
    primaryAction: { label: "Request Invoice", icon: "fas fa-paper-plane" },
  },
];

type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
  ccv: string;
  isDefault?: boolean;
};

// Payment cards will be fetched from backend in future
const PAYMENT_CARDS: PaymentCard[] = [];

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
                    <button className="btn download-btn w-100" type="button">
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
  return (
    <section className="account-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Payment Methods</h2>
        <button className="btn btn-primary" type="button">
          <i className="fas fa-plus me-2" aria-hidden="true" />
          Add New Card
        </button>
      </div>

      <div className="row g-4">
        {PAYMENT_CARDS.map((card) => (
          <div className="col-lg-4 col-md-6" key={card.id}>
            <div className="card payment-card h-100">
              <div className="card-body position-relative p-4">
                <button className="delete-card-btn" title="Delete card" type="button">
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
                  <div>
                    <small className="text-white-50 d-block">CCV</small>
                    <div className="fw-semibold">{card.ccv}</div>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-sm btn-outline-light" type="button">
                      <i className="fas fa-sync-alt me-1" aria-hidden="true" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-lg-4 col-md-6">
          <div className="card add-card h-100 d-flex align-items-center justify-content-center">
            <div className="text-center p-4">
              <button className="btn btn-outline-primary rounded-circle mb-3" type="button" style={{ width: 60, height: 60 }}>
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
    </section>
  );
}

function HistoryTab() {
  return (
    <section className="account-content">
      <HistorySection title="Flights" icon="fas fa-plane" items={FLIGHT_HISTORY} actionLabel="See all" />
      <HistorySection title="Hotels" icon="fas fa-hotel" items={HOTEL_HISTORY} actionLabel="See all" />
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
