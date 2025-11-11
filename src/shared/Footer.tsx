import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="pt-5 pb-5">
      <div className="container">
        <div className="row gx-4 gy-3">
          <div className="col-lg-3 col-md-12 col-12 first-column">
            <div className="wrap">
              <a className="footer-logo" href="/index.html">
                <img src="src/assets/images/Phnes. Travels.png" alt="" className="footer-img" />
              </a>
              <div className="social-links mt-1">
                <a href="https://www.facebook.com"><i className="fa-brands fa-facebook" /></a>
                <a href="https://www.x.com"><i className="fa-brands fa-twitter" /></a>
                <a href="https://www.youtube.com"><i className="fa-brands fa-youtube" /></a>
                <a href="https://www.instagram.com"><i className="fa-brands fa-instagram" /></a>
              </div>
            </div>
          </div>

          <div className="col-lg-1 col-md-6 col-6">
            <h3 className="fw-bold p-0 mb-2 heading">Links</h3>
            <ul className="footer-links">
              <li className="mb-2">
                <Link to="/flights" className="text-capitalize">Flights</Link>
              </li>
              <li className="mb-2">
                <Link to="/stay" className="text-capitalize">Stay</Link>
              </li>
              <li className="mb-2">
                <Link to="/discover" className="text-capitalize">Discover</Link>
              </li>
              <li className="mb-2">
                <Link to="/about-us" className="text-capitalize">About us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-capitalize">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h3 className="fw-bold p-0 mb-2 heading">Our Activites</h3>
            <ul className="footer-links">
              <li className="mb-2"><Link to="/tours" className="text-capitalize">Tours</Link></li>
              <li className="mb-2"><Link to="/kayaking" className="text-capitalize">Kayaking</Link></li>
              <li className="mb-2"><Link to="/cruising" className="text-capitalize">Cruising &amp; Sailing</Link></li>
              <li className="mb-2"><Link to="/multi-activities" className="text-capitalize">Multi-activities</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h3 className="fw-bold p-0 mb-2 heading">About Us</h3>
            <ul className="footer-links">
              <li className="mb-2"><Link to="/our-story" className="text-capitalize">Our story</Link></li>
              <li className="mb-2"><Link to="/work-with-us" className="text-capitalize">Work with us</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h3 className="fw-bold p-0 mb-2 heading">Contact</h3>
            <ul className="footer-links" id="company-info">
              <li className="mb-2 text-capitalize">Address:Pe.Holandia no.205A</li>
              <li className="mb-2 text-capitalize">millenium city</li>
              <li className="mb-2 text-capitalize">phone: 023 456 7890</li>
              <li className="mb-2 text-capitalize">email:blabla@gmail.com</li>
              <li className="mb-2 text-capitalize">maps:millenium city</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
