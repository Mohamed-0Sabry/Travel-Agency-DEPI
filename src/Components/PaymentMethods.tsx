import React, { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { AddPaymentMethodData } from "@/types/api.types";
import { transformPaymentMethod } from "./AccountHelpers";

export default function PaymentMethods() {
  const {
    paymentMethods,
    isLoading,
    error,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentStore();
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
      isDefault: paymentMethods.length === 0,
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
    if (
      !formData.billingAddress.street ||
      !formData.billingAddress.city ||
      !formData.billingAddress.country ||
      !formData.billingAddress.postalCode
    ) {
      setFormError("All billing address fields are required");
      return;
    }

    try {
      await addPaymentMethod(formData);
      setShowAddModal(false);
      setFormError(null);
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || "Failed to add payment method"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
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

  return (
    <section className="account-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Payment Methods</h2>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleAddCard}
        >
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
                  <h5 className="card-number mb-0">
                    **** **** **** {card.last4}
                  </h5>
                </div>
                <div className="mb-3">
                  <small className="text-white-50 d-block">
                    Cardholder Name
                  </small>
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
              <p className="text-muted mb-0">
                Add another payment method to your account
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div
            className="card h-100"
            style={{ border: "2px solid #0070ba", borderRadius: 15 }}
          >
            <div className="card-body d-flex align-items-center justify-content-center text-center p-4">
              <div>
                <i
                  className="fab fa-paypal fa-3x text-primary mb-3"
                  aria-hidden="true"
                />
                <h5 className="mb-2">PayPal</h5>
                <p className="text-muted mb-3">
                  Link your PayPal account and pay securely
                </p>
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
          <i
            className="fas fa-credit-card fa-3x text-muted mb-3"
            aria-hidden="true"
          />
          <p className="text-muted">
            You don't have any payment methods yet. Add one to get started!
          </p>
        </div>
      )}

      <div className="mt-5">
        <div
          className="alert alert-info d-flex align-items-center"
          role="alert"
        >
          <i className="fas fa-shield-alt fa-2x me-3" aria-hidden="true" />
          <div>
            <h6 className="mb-1">Your payment information is secure</h6>
            <small>
              We use industry-standard encryption to protect your payment data.
              Your card details are never stored on our servers.
            </small>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cardType: e.target.value as
                            | "VISA"
                            | "MASTERCARD"
                            | "AMEX"
                            | "DISCOVER",
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastFourDigits: e.target.value.replace(/\D/g, ""),
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cardholderName: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Billing Address - Street
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.billingAddress.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            street: e.target.value,
                          },
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
                            billingAddress: {
                              ...formData.billingAddress,
                              city: e.target.value,
                            },
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
                            billingAddress: {
                              ...formData.billingAddress,
                              postalCode: e.target.value,
                            },
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
                          billingAddress: {
                            ...formData.billingAddress,
                            country: e.target.value,
                          },
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                      id="setAsDefault"
                    />
                    <label className="form-check-label" htmlFor="setAsDefault">
                      Set as primary payment method
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
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
