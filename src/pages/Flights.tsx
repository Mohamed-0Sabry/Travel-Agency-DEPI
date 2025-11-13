import FlightDestinations from "@/features/FlightDestinations";
import FlightDiscover from "@/features/FlightDiscover";
import FlightHero from "@/features/FlightHero";

const Flights = () => {
  return (
    <>
      <FlightHero />
      <FlightDiscover />
      <FlightDestinations />
    </>
  );
};

export default Flights;
