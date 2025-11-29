import React, { useState } from "react";
import "../../Styles/testimonialsSection.css";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  images: string[];
}

const TestimonialsSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const testimonials: Testimonial[] = [
    // ... same data as before
  ];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[activeSlide];

  return (
    <div className="testomonials-section">
      <div className="carousel-wrapper">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`carousel-item ${index === activeSlide ? "active" : ""}`}
          >
            <img
              src="/assets/LandingPage/testomonialImg.png"
              alt="testimonial background"
            />
          </div>
        ))}

        <div className="carousel-text">
          <h5>Testimonials</h5>
          <p className="title">What they say about us</p>
          <div className="stars">
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
          </div>
          <p>{currentTestimonial.text}</p>
          <h1>{currentTestimonial.name}</h1>
          <div className="circles">
            {currentTestimonial.images.map((img, idx) => (
              <img key={idx} src={img} alt={`avatar-${idx}`} />
            ))}
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialsSection;
