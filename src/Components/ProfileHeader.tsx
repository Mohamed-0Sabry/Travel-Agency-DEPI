import React from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileHeader() {
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
                  <span
                    className="status-indicator"
                    aria-label="Verified contact"
                  >
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
