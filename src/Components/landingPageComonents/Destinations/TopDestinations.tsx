import React from "react";
import DestinationCard, {
  type DestinationCardProps,
} from "../ReusableCard/DestinationCard";
import "../../../Styles/DestinationCard.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

interface TopDestinationsProps {
  destinations: (DestinationCardProps & { id: number | string })[];
}

const TopDestinations: React.FC<TopDestinationsProps> = ({ destinations }) => {
  return (
    <section className="Destinations-section">
      <div className="text">
        <span>Top Destinations</span>
        <h1>Discover your love</h1>
      </div>

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
        {destinations.map((item) => (
          <SwiperSlide key={item.id}>
            <DestinationCard
              image={item.image}
              title={item.title}
              location={item.location}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TopDestinations;
