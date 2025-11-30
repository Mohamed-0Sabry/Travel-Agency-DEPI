// src/components/landingPageComponents/HeroSection.tsx
import React from "react";
import data from "../../../src/data/destinationsData.json";
import "../../styles/heroSection.css";
import "../../styles/responsiveLandingPage.css";
import {
  type HeroSectionData,
  type SearchField,
  type HeroButton,
} from "@/types/Landing"; // adjust path as needed

type HeroProps = {
  hero?: HeroSectionData | null;
};

export default function HeroSection({ hero: heroProp }: HeroProps) {
  // fallback to JSON file's heroSection if prop not provided
  const hero: HeroSectionData | undefined =
    heroProp ?? data.heroSection;

  if (!hero) return null;

  const searchFields = Array.isArray(hero.searchFields)
    ? (hero.searchFields as SearchField[])
    : [];

  const button: HeroButton | undefined = hero.button;

  return (
    <div className="hero_section">
      {/* Logo */}
      {hero.logo && <img src={hero.logo} alt={hero.heading ?? "Hero"} />}

      {/* Title */}
      {hero.heading && <h1>{hero.heading}</h1>}
      {hero.description && <p>{hero.description}</p>}

      {/* Search bar */}
      <div className="search-section">
        {searchFields.map((field) => (
          <a key={String(field.id)}>
            {field.icon && <i className={field.icon}></i>}
            {field.label}
          </a>
        ))}

        <button
          onClick={() => {
            if (button?.action) {
              // If you want SPA nav, replace with router push instead
              window.location.href = button.action;
            }
          }}
        >
          {button?.label} {button?.icon && <i className={button.icon}></i>}
        </button>
      </div>
    </div>
  );
}
