import React from 'react';

// Discover Component using Bootstrap
// Usage: <Discover />

export default function Discover() {
  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h1 className="display-5">Discover Your Next Destination</h1>
          <p className="lead">اكتشف أفضل الرحلات والعروض مع TravelAgency. خطط رحلتك بدقة وسهولة.</p>
          <a href="#packages" className="btn btn-primary me-2">View Packages</a>
          <a href="#contact" className="btn btn-outline-secondary">Contact Us</a>
        </div>
        <div className="col-md-6">
          <img src="src/assets/images/banner.png" className="img-fluid rounded" alt="Discover" />
        </div>
      </div>

      {/* Packages Section */}
      <section id="packages"> 
        <h2 className="mb-4">Popular Packages</h2>
        <div className="row">
          {[1,2,3].map((num) => (
            <div key={num} className="col-md-4 mb-3">
              <div className="card h-100">
                <img src={`src/assets/images/destination-${num}.jpg`} className="card-img-top" alt={`Package ${num}`} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Package {num}</h5>
                  <p className="card-text">Description of package {num} goes here.</p>
                  <div className="mt-auto">
                    <a href="#" className="btn btn-sm btn-primary">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mt-5">
        <div className="p-4 bg-light rounded">
          <h3>Get in touch</h3>
          <p>هل عندك استفسار؟ ارسل لنا رسالتك وسنرد عليك.</p>
          <form>
            <div className="row g-2">
              <div className="col-md-6">
                <input className="form-control" placeholder="Your name" />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Email" />
              </div>
              <div className="col-12">
                <textarea className="form-control" rows={4} placeholder="Message"></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary mt-2">Send</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
