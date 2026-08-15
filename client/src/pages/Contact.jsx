import React, { useState } from 'react';
import '../styles/Home.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiry: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>
            Have questions about our hostel facilities or want to book a room?
            We'd love to hear from you. Reach out and we'll get back within 24 hours.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-info-card">
            <h2>Contact Information</h2>
            <p>Fill out the form and our hostel team will get back to you as soon as possible.</p>

            <div className="contact-info-item">
              <div className="contact-info-icon">📍</div>
              <div className="contact-info-text">
                <strong>Address</strong>
                <span>12 College Road, Shivaji Nagar, Pune, Maharashtra 411005</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div className="contact-info-text">
                <strong>Phone</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">✉️</div>
              <div className="contact-info-text">
                <strong>Email</strong>
                <span>info@hostelmanage.in</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">🕐</div>
              <div className="contact-info-text">
                <strong>Office Hours</strong>
                <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>

            <div className="contact-social-row">
              <a href="https://www.facebook.com/profile.php?id=61590433170519" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Facebook">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="https://www.instagram.com/zxy_tanmay/" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Instagram">
                <i className="bx bxl-instagram"></i>
              </a>
              <a href="https://x.com/Zxy_Tanmay" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Twitter (X)">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/tanmayrongre/" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="LinkedIn">
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Form Card */}
          <div className="contact-form-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ color: '#fff', margin: '0 0 10px', fontSize: 22 }}>Message Sent!</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: 24,
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontFamily: 'Poppins,sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2>Send a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Tanmay"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Rongre"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label>Inquiry Type</label>
                    <select
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="booking">Room Booking</option>
                      <option value="fees">Fees & Payment</option>
                      <option value="facilities">Facilities</option>
                      <option value="complaint">Complaint / Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-send" style={{ fontSize: 18 }}></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}