import React from "react";
import data from "../../../data/destinationsData.json";
import "../../styles/heroSection.css";
import "../../styles/responsiveLandingPage.css";

type HeroProps = {
  hero?: any;
};

export default function HeroSection({ hero: heroProp }: HeroProps) {
  const hero = heroProp ?? (data as any).heroSection;
  if (!hero) return null;

  return (
    <div className="hero_section">
      {/* Logo */}
      <img src={hero.logo} alt="Hero" />

      {/* Title */}
      <h1>{hero.heading}</h1>
      <p>{hero.description}</p>

      {/* Search bar */}
      <div className="search-section">
        {Array.isArray(hero.searchFields) &&
          hero.searchFields.map((field: any) => (
            <a key={field.id}>
              <i className={field.icon}></i>
              {field.label}
            </a>
          ))}

        <button
          onClick={() => {
            if (hero.button && hero.button.action) {
              window.location.href = hero.button.action;
            }
          }}
        >
          {hero.button?.label} <i className={hero.button?.icon}></i>
        </button>
      </div>
    </div>
  );
}
