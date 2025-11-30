// src/pages/LandingPage.tsx
import React, { useState, useEffect } from "react";
import HeroSection from "../Components/landingPageComonents/HeroSection";
import AboutSection from "../Components/landingPageComonents/AboutSection";
// import VideoSection from "../Components/landingPageComonents/VideoSection";
import DestinationSection from "../Components/landingPageComonents/Destinations/DestinationSection";
import TestimonialsSection from "../Components/landingPageComonents/TestimonialsSection";
import { type LandingData, type FlightOffer } from "@/types/Landing";


const demoLanding: LandingData = {
  heroSection: {
    logo: "/images/logo-demo.png",
    heading: "Explore The World",
    description: "Find the best flights, destinations and travel packages.",
    searchFields: [
      { id: 1, icon: "fa-solid fa-plane-departure", label: "Flights" },
      { id: 2, icon: "fa-solid fa-hotel", label: "Hotels" },
      { id: 3, icon: "fa-solid fa-car", label: "Cars" },
    ],
    button: {
      label: "Search",
      icon: "fa-solid fa-magnifying-glass",
      action: "/search",
    },
  },
  aboutSection: {
    title: "Why Travel With Us?",
    content: "We offer the best prices, top destinations and unbeatable travel experiences.",
  },
  topDestinations: [
    { id: 1, city: "Paris", image: "/images/paris.jpg" },
    { id: 2, city: "Tokyo", image: "/images/tokyo.jpg" },
  ],
  specialOffers: [],
  tourPackages: [],
  filters: [],
  videoSection: null,
};



export default function LandingPage() {
  const [landing] = useState<LandingData>(demoLanding);
  // const [offers, setOffers] = useState<FlightOffer[]>([]);

  // If you want to seed landing from a local JSON file:
  // import data from "../../data/destinationsData.json";
  // useEffect(() => setLanding(data as LandingData), []);


  // useEffect(() => {
  //   // let mounted = true;
  //   fetch("http://localhost:5000/api/flights/offers", { cache: "no-store" })
  //   .then(res => res.json())
  //   .then(json => setOffers(json.data || []));
  // }, []);


  // console.log(offers);

  // while landing is null you might want to render placeholder or load default
  // If you prefer to show hero even when landing is null (fallback to JSON), set landing null is OK.
  if (!landing) return <p>Loading...</p>;

  return (
    <>
      <HeroSection hero={landing.heroSection} />

      <AboutSection about={landing.aboutSection} />
      {/* <VideoSection video={landing.videoSection} /> */}
      {/* <VideoSection /> */}

      <DestinationSection
        // uncomment and pass typed props when you have them defined
        // destinations={landing.topDestinations}
        // offers={landing.specialOffers}
        // packages={landing.tourPackages}
        // filters={landing.filters}
        // flights={offers}
      />

      <TestimonialsSection />
    </>
  );
}
