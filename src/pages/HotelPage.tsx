import HotelsList from "@/Components/HotelPageComponents/HotelsList";
import HotelDiscover from "@/Features/FlightDiscover";
import HotelHero from "@/Features/FlightHero";

const Hotels = () => {
  return (
    <>
      <HotelHero />
      <HotelDiscover />
      <HotelsList />
    </>
  );
};

export default Hotels;
