import React from "react";
import type { HistoryItem } from "./AccountHelpers";

export default function HistorySection({
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
                  <img
                    src={item.logo}
                    alt={item.logoAlt}
                    className="airline-logo"
                  />
                </div>
                <div className="col-lg-2 col-md-4 col-9">
                  <strong className="d-block">{item.title}</strong>
                  <small className="text-muted">{item.subtitle}</small>
                </div>
                <div className="col-lg-5 col-md-4 col-12">
                  <div className="row gy-2">
                    {item.meta.map((meta) => (
                      <div
                        className="col-sm-6 col-12"
                        key={`${item.id}-${meta.label}`}
                      >
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
                        <i
                          className={`${item.primaryAction.icon} me-2`}
                          aria-hidden="true"
                        />
                      ) : null}
                      {item.primaryAction.label}
                    </button>
                  </div>
                ) : null}
                {item.secondaryActionIcon ? (
                  <div className="col-lg-1 d-none d-lg-block text-end">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      aria-label="View details"
                    >
                      <i
                        className={item.secondaryActionIcon}
                        aria-hidden="true"
                      />
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
