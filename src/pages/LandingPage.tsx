import React from 'react';
import HeroSection from '../Components/landingPageComponents/HeroSection';
import AboutSection from '../Components/landingPageComponents/AboutSection';
import VideoSection from '../Components/landingPageComponents/VideoSection';
import DestinationsSection from '../Components/landingPageComponents/Destinations/DestinationSection';
import TestimonialsSection from '../Components/landingPageComponents/TestimonialsSection';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper-bundle.css';
import '@/styles/landingPage.css';


function App() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <DestinationsSection />
      <TestimonialsSection />
    </>
  );
}

export default App;