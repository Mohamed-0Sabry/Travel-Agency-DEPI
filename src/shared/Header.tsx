import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "../Components/Modal";

const togglePasswordIcon = (inputId: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
  const icon = input.nextElementSibling?.querySelector("i");
  if (icon) {
    icon.className =
      input.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  }
};

const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <NavLink className="navbar-brand me-5" to="/">
              <img
                src="src/assets/images/logo.png"
                alt="Logo"
                className="nav-logo"
              />
            </NavLink>

            <button
              className={`navbar-toggler ${isNavOpen ? "" : "collapsed"}`}
              type="button"
              aria-controls="navbarSupportedContent"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
              onClick={() => setIsNavOpen((s) => !s)}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/flights"
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    Flights
                  </NavLink>
                </li>
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/hotels"
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    Hotels
                  </NavLink>
                </li>
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/discover"
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    Discover
                  </NavLink>
                </li>
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/about-us"
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    About
                  </NavLink>
                </li>
                <li className="nav-item pe-lg-4">
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive ? "nav-link active fs-5" : "nav-link fs-5"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>

              <div className="login-sign-up d-flex">
                <div className="home-login me-4">
                  <a
                    href="#"
                    className="login fs-5"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLoginModal(true);
                      setIsNavOpen(false);
                    }}
                  >
                    Login
                  </a>
                </div>
                <div className="up">
                  <a
                    href="#"
                    className="home-sign-up pe-3 ps-3 pt-2 pb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSignupModal(true);
                      setIsNavOpen(false);
                    }}
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Signup Modal */}
        <Modal
          id="signupModal"
          title={
            <div className="w-100">
              <div className="text-center mb-3">
                <img
                  src="src/assets/images/logo.png"
                  alt="Logo"
                  style={{ maxWidth: 120 }}
                />
              </div>
              <h1 className="modal-title fs-4 text-center">Sign Up</h1>
              <p className="text-center login-desc">
                Create your account to get started
              </p>
            </div>
          }
          show={showSignupModal}
          onClose={() => setShowSignupModal(false)}
        >
          <form>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="fullName" />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="signupPassword"
                name="password"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordIcon("signupPassword")}
              >
                <i className="fa-solid fa-eye-slash" />
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordIcon("confirmPassword")}
              >
                <i className="fa-solid fa-eye-slash" />
              </span>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreeTerms"
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{" "}
                <a href="#" className="terms-link">
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 mb-3"
              onClick={() => setShowSignupModal(false)}
            >
              Sign Up
            </button>
          </form>

          <div className="login-link">
            <p>
              Already Have An Account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
              >
                Login
              </a>
            </p>
          </div>

          <div className="social-login-divider">Or Sign Up With</div>

          <div className="social-login-buttons d-flex gap-2">
            <button
              className="social-btn facebook-btn"
              aria-label="Sign up with Facebook"
            >
              <i className="fa-brands fa-facebook" />
            </button>
            <button
              className="social-btn google-btn"
              aria-label="Sign up with Google"
            >
              {/* google svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.69 1.22 9.19 3.6l6.85-6.85C35.9 2.4 30.47 0 24 0 14.63 0 6.43 5.4 2.56 13.28l7.98 6.19C12.26 13.09 17.73 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24.5c0-1.57-.14-3.08-.39-4.5H24v9h12.65c-.55 2.96-2.26 5.48-4.84 7.18l7.45 5.77C43.6 38.02 46.5 31.77 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.47A14.5 14.5 0 019.5 24c0-1.57.27-3.08.74-4.47l-7.98-6.19A23.86 23.86 0 000 24c0 3.86.93 7.52 2.56 10.72l7.98-6.25z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.48 0 11.91-2.13 15.87-5.77l-7.45-5.77c-2.08 1.4-4.75 2.27-8.42 2.27-6.27 0-11.74-3.59-14.46-8.72l-7.98 6.25C6.43 42.6 14.63 48 24 48z"
                />
              </svg>
            </button>
            <button
              className="social-btn apple-btn"
              aria-label="Sign up with Apple"
            >
              <i className="fa-brands fa-apple" />
            </button>
          </div>

          {/* logos at the end of the modal */}
          <div className="modal-foot-logos text-center mt-3">
            <img
              src="src/assets/images/logo.png"
              alt="Company logo"
              style={{ maxWidth: 84 }}
            />
          </div>
        </Modal>

        {/* Login Modal */}
        <Modal
          id="loginModal"
          title={
            <div className="w-100">
              <div className="text-center mb-3">
                <img
                  src="src/assets/images/logo.png"
                  alt="Logo"
                  style={{ maxWidth: 120 }}
                />
              </div>
              <h1 className="modal-title fs-4 text-center">Login</h1>
              <p className="text-center login-desc">
                Login to access your photos
              </p>
            </div>
          }
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        >
          <form>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                name="password"
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordIcon("loginPassword")}
              >
                <i className="fa-solid fa-eye-slash" />
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="remember-me-wrapper">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label htmlFor="rememberMe" className="form-check-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 mb-3"
              onClick={() => setShowLoginModal(false)}
            >
              Login
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don't Have An Account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
              >
                Sign Up
              </a>
            </p>
          </div>

          <div className="social-login-divider">Or Login With</div>

          <div className="social-login-buttons d-flex gap-2">
            <button
              className="social-btn facebook-btn"
              aria-label="Login with Facebook"
            >
              <i className="fa-brands fa-facebook" />
            </button>
            <button
              className="social-btn google-btn"
              aria-label="Login with Google"
            >
              {/* google svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.69 1.22 9.19 3.6l6.85-6.85C35.9 2.4 30.47 0 24 0 14.63 0 6.43 5.4 2.56 13.28l7.98 6.19C12.26 13.09 17.73 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24.5c0-1.57-.14-3.08-.39-4.5H24v9h12.65c-.55 2.96-2.26 5.48-4.84 7.18l7.45 5.77C43.6 38.02 46.5 31.77 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.47A14.5 14.5 0 019.5 24c0-1.57.27-3.08.74-4.47l-7.98-6.19A23.86 23.86 0 000 24c0 3.86.93 7.52 2.56 10.72l7.98-6.25z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.48 0 11.91-2.13 15.87-5.77l-7.45-5.77c-2.08 1.4-4.75 2.27-8.42 2.27-6.27 0-11.74-3.59-14.46-8.72l-7.98 6.25C6.43 42.6 14.63 48 24 48z"
                />
              </svg>
            </button>
            <button
              className="social-btn apple-btn"
              aria-label="Login with Apple"
            >
              <i className="fa-brands fa-apple" />
            </button>
          </div>

          <div className="modal-foot-logos text-center mt-3">
            <img
              src="src/assets/images/logo.png"
              alt="Company logo"
              style={{ maxWidth: 84 }}
            />
          </div>
        </Modal>
      </header>
    </>
  );
};

export default Navbar;
