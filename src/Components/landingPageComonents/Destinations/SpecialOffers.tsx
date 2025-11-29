import React from "react";
import DestinationCard, {
  type DestinationCardProps,
} from "../ReusableCard/DestinationCard";
import "../../../styles/SpecialOffers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

interface Offer {
  id: number;
  image: string;
  title: string;
  location?: string;
  rating?: number;
  price?: string;
}

interface Props {
  offers: Offer[];
}

const SpecialOffers: React.FC<Props> = ({ offers }) => {
  return (
    <section className="Destinations-section">
      <div className="text">
        <span>Special Offer</span>
        <h1>Check out our special offer and discounts</h1>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="destinations-swiper"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <DestinationCard {...offer} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SpecialOffers;
