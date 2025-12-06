import { useState, useEffect } from "react";
import "@/styles/account.css";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileHeader from "../Components/ProfileHeader";
import AccountDetails from "../Components/AccountDetails";
import HistoryTab from "../Components/HistoryTab";
import PaymentMethods from "../Components/PaymentMethods";

const ACCOUNT_TABS = [
  { id: "account", label: "Account" },
  { id: "history", label: "History" },
  { id: "payment", label: "Payment methods" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<string>(ACCOUNT_TABS[0].id);

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
            className={`tab-pane fade ${
              activeTab === "account" ? "show active" : ""
            }`}
            role="tabpanel"
            aria-labelledby="account-tab"
          >
            {activeTab === "account" ? <AccountDetails /> : null}
          </div>

          <div
            id="history-panel"
            className={`tab-pane fade ${
              activeTab === "history" ? "show active" : ""
            }`}
            role="tabpanel"
            aria-labelledby="history-tab"
          >
            {activeTab === "history" ? <HistoryTab /> : null}
          </div>

          <div
            id="payment-panel"
            className={`tab-pane fade ${
              activeTab === "payment" ? "show active" : ""
            }`}
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
