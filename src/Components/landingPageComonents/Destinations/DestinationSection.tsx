import React, { useEffect, useState } from "react";
import TopDestinations from "./TopDestinations";
import SpecialOffers from "./SpecialOffers";
import TourPackages from "./TourPackages";
import FlightOffers from "./FlightOffers";
import data from "../../../data/destinationsData.json";

interface DestinationData {
  topDestinations: any[];
  specialOffers: any[];
  tourPackages: any[];
  flightOffers: any[];
  filters: string[];
}

const DestinationSection: React.FC = () => {
  const [content, setContent] = useState<DestinationData | null>(null);

  useEffect(() => {
    setContent(data);
  }, []);

  if (!content) return <p>Loading...</p>;

  return (
    <>
      <TopDestinations destinations={content.topDestinations} />
      <SpecialOffers offers={content.specialOffers} />
      <TourPackages packages={content.tourPackages} filters={content.filters} />
      <FlightOffers flights={content.flightOffers} />
    </>
  );
};

export default DestinationSection;
