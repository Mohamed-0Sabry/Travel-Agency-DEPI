import FlightDestinations from "@/Features/FlightDestinations";
import FlightDiscover from "@/Features/FlightDiscover";
import FlightHero from "@/Features/FlightHero";

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
