/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import "@/styles/contactPage.css"

interface Form {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<Form>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email looks invalid';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    setStatus(null);

    // Simulated request - replace with real API endpoint
    try {
      await new Promise((res) => setTimeout(res, 900));
      // if you want to send to real endpoint:
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form), headers: {'Content-Type':'application/json'} })
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="contact-hero d-flex align-items-center text-white">
        <div className="hero-overlay" aria-hidden></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 2 }}>
          <p className="eyebrow mb-2">Get in touch</p>
          <h1 className="display-5 fw-bold">Contact <span className="accent">Us</span></h1>
          <p className="lead text-white-75">Questions, partnerships or custom trip requests — we’re here to help.</p>
        </div>
      </section>

      <main className="container my-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-panel p-4 p-md-5 shadow-sm">
              <h3 className="mb-3">Send us a message</h3>
              <p className="text-muted mb-4">We usually reply within 24 hours. Please provide as much detail as you can.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Your full name"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Subject (optional)"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      placeholder="Tell us about your plans or question"
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  </div>

                  <div className="col-12 d-flex align-items-center gap-3">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden></span>
                          Sending...
                        </>
                      ) : (
                        'Send message'
                      )}
                    </button>

                    <div className="ms-auto text-muted small">Or email us directly: <a href="mailto:hello@phnestravels.com">hello@phnestravels.com</a></div>
                  </div>
                </div>
              </form>

              <div role="status" aria-live="polite" className="mt-3">
                {status === 'success' && <div className="alert alert-success py-2">Thanks — your message was sent.</div>}
                {status === 'error' && <div className="alert alert-danger py-2">Sorry — something went wrong. Please try again later.</div>}
              </div>
            </div>

            <div className="mt-4 text-muted small">By contacting us, you agree to our <a href="#">privacy policy</a>.</div>
          </div>

          <aside className="col-lg-5">
            <div className="glass-panel p-3 shadow-sm mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="ri-map-pin-2-fill fs-3 text-primary"></i>
                <div>
                  <div className="small text-muted">Head Office</div>
                  <div className="fw-bold">123 Traveler Lane, Cairo, Egypt</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="ri-phone-fill fs-3 text-primary"></i>
                <div>
                  <div className="small text-muted">Phone</div>
                  <a href="tel:+201234567890" className="fw-bold">+20 123 456 7890</a>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="ri-mail-fill fs-3 text-primary"></i>
                <div>
                  <div className="small text-muted">Email</div>
                  <a href="mailto:hello@phnestravels.com" className="fw-bold">hello@phnestravels.com</a>
                </div>
              </div>

              <hr />

              <h6 className="mb-2">Follow us</h6>
              <div className="d-flex gap-2">
                <a className="social" href="#" aria-label="instagram"><i className="ri-instagram-line"></i></a>
                <a className="social" href="#" aria-label="facebook"><i className="ri-facebook-line"></i></a>
                <a className="social" href="#" aria-label="twitter"><i className="ri-twitter-line"></i></a>
                <a className="social" href="#" aria-label="youtube"><i className="ri-youtube-line"></i></a>
              </div>
            </div>

            <div className="glass-panel p-0 overflow-hidden shadow-sm">
              <iframe
                title="office-location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.123456789012!2d31.233334!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145847b8f8c8a1a1%3A0xabcdef1234567890!2sCairo!5e0!3m2!1sen!2seg!4v0000000000000"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
