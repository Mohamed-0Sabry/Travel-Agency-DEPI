import { useState } from "react";
import { Card } from "../ui/Card";


const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Alice Smith',
      role: 'Travel Blogger',
      image: 'https://i.pravatar.cc/150?img=1',
      text: 'A real sense of community, nurtured. Really appreciate the help and support from the staff during my trips. Very helpful and always available when needed. The experience was absolutely incredible!',
      rating: 5,
      trips: 12,
    },
    {
      name: 'John Doe',
      role: 'Adventure Enthusiast',
      image: 'https://i.pravatar.cc/150?img=2',
      text: 'Excellent service and support throughout my journey. The team was always there when I needed assistance. Highly recommend to anyone looking for a seamless travel experience.',
      rating: 5,
      trips: 8,
    },
    {
      name: 'Sarah Johnson',
      role: 'Digital Nomad',
      image: 'https://i.pravatar.cc/150?img=3',
      text: 'Outstanding experience! The attention to detail and customer care was beyond my expectations. They truly understand what travelers need.',
      rating: 5,
      trips: 15,
    },
  ];

  const nextSlide = () => setActiveIndex((i) => (i + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[activeIndex];

  return (
    <section className="testimonials-section py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-badge mb-3">Testimonials</div>
            <h2 className="display-5 fw-bold mb-3">What Our <span className="text-gradient">Travelers Say</span></h2>
            <p className="text-muted fs-6">Real stories from real travelers who experienced unforgettable journeys</p>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <Card
              image={{ src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1000&fit=crop', alt: 'Happy traveler', top: true, cover: true, height: 420 }}
              className="h-100"
            >
              <div className="row g-3">
                <div className="col-6">
                  <div>
                    <h3 className="fw-bold mb-0">5,000+</h3>
                    <p className="text-muted small mb-0">Happy Travelers</p>
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <h3 className="fw-bold mb-0">4.9★</h3>
                    <p className="text-muted small mb-0">Average Rating</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-6">
            <Card className="h-100">
              <div className="quote-icon mb-3"><i className="ri-double-quotes-l fs-2 text-primary"></i></div>

              <div className="rating mb-2">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <i key={i} className="ri-star-fill me-1 text-warning"></i>
                ))}
              </div>

              <p className="testimonial-text lead">"{current.text}"</p>

              <div className="d-flex align-items-center my-3">
                <img src={current.image} alt={current.name} className="rounded-circle me-3" style={{ width: 56, height: 56, objectFit: 'cover' }} />
                <div>
                  <h6 className="mb-0 fw-bold">{current.name}</h6>
                  <small className="text-muted">{current.role}</small>
                  <div className="d-flex align-items-center mt-1">
                    <i className="ri-map-pin-line me-1 text-muted small"></i>
                    <small className="text-muted">{current.trips} trips completed</small>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setActiveIndex(index)} className={`btn btn-sm ${index === activeIndex ? 'btn-primary' : 'btn-outline-secondary'} me-1`} aria-label={`Go to testimonial ${index + 1}`}></button>
                  ))}
                </div>

                <div>
                  <button className="btn btn-outline-secondary btn-sm me-2" onClick={prevSlide}><i className="ri-arrow-left-line"></i></button>
                  <button className="btn btn-primary btn-sm" onClick={nextSlide}><i className="ri-arrow-right-line"></i></button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};


export default TestimonialsSection;