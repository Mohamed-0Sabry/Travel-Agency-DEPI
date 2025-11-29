import { useState, useEffect } from "react";
import HeroSection from "../Components/landingPageComonents/HeroSection";
import AboutSection from "../Components/landingPageComonents/AboutSection";
import VideoSection from "../Components/landingPageComonents/VideoSection";
import DestinationSection from "../Components/landingPageComonents/Destinations/DestinationSection";
import TestimonialsSection from "../Components/landingPageComonents/TestimonialsSection";

export default function LandingPage() {
  const [landing, setLanding] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/landing")
      .then((res) => res.json())
      .then(setLanding);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/offers")
      .then((res) => res.json())
      .then((json) => setOffers(json.data));
  }, []);

  if (!landing) return <p>Loading...</p>;

  return (
    <>
      <HeroSection hero={landing.heroSection} />

      {/* <AboutSection about={landing.aboutSection} />
      <VideoSection video={landing.videoSection} />

      <DestinationSection
        destinations={landing.topDestinations}
        offers={landing.specialOffers}
        packages={landing.tourPackages}
        filters={landing.filters}
        flights={offers}
      /> */}

      <TestimonialsSection />
    </>
  );
}
