import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import DestinationCard, {
  DestinationCardProps,
} from "../ReusableCard/DestinationCard";
import "../../../Styles/TourPackages.css";

interface TourPackagesProps {
  packages?: (DestinationCardProps & { id: number | string })[];
  filters?: string[];
}

const TourPackages: React.FC<TourPackagesProps> = ({
  packages = [],
  filters = [],
}) => {
  return (
    <section className="Destinations-section">
      <div className="text">
        <span>Tour Packages</span>
        <h1>Check out our packages</h1>
      </div>

      {filters.length > 0 && (
        <div className="destination-filter-section">
          <div className="filter-container">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                className={`filter-btn ${idx === 0 ? "active" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        autoplay={{ delay: 3000 }}
        className="destinations-swiper"
      >
        {packages.map((pkg) => (
          <SwiperSlide key={pkg.id}>
            <DestinationCard {...pkg} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TourPackages;
