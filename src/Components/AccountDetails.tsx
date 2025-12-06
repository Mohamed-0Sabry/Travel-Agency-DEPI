import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { UpdateProfileData } from "@/types/api.types";
import { formatDate, formatDateForInput } from "./AccountHelpers";

export default function AccountDetails() {
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
      editable: true,
    },
    {
      label: "Email",
      value: user?.email || "Not set",
      fieldKey: "email",
      editable: false,
    },
    {
      label: "Password",
      value: "••••••••••••",
      fieldKey: "password",
      secure: true,
      editable: false,
    },
    {
      label: "Phone number",
      value: user?.phoneNumber || "Not set",
      fieldKey: "phoneNumber",
      editable: true,
    },
    {
      label: "Address",
      value: user?.address || "Not set",
      fieldKey: "address",
      editable: true,
    },
    {
      label: "Date of birth",
      value: formatDate(user?.dateOfBirth),
      fieldKey: "dateOfBirth",
      editable: true,
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
                  {secure && (
                    <small className="text-muted">
                      Last updated 3 months ago
                    </small>
                  )}
                </>
              )}
            </div>
            <div className="col-md-4 text-md-end">
              {editable && !editingField && (
                <button
                  className="btn edit-btn"
                  type="button"
                  onClick={() =>
                    handleEdit(
                      label,
                      fieldKey === "dateOfBirth"
                        ? formatDateForInput(user?.dateOfBirth)
                        : (user as any)?.[fieldKey] || ""
                    )
                  }
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
