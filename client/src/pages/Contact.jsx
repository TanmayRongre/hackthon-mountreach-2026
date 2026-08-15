import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Home.css';
import useInView from '../hooks/useInView';


const demoValues = {
  firstName: 'Tanmay',
  lastName: 'Rongre',
  email: 'tanmay@mountreach.edu',
  phone: '+91 98765 43210',
  inquiry: 'booking',
  message: 'Hello, I would like to inquire about the room allotment process for the upcoming semester and facility details for Block A.',
};

export default function Contact() {
  const [formData, setFormData] = useState(demoValues);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const { ref: headerRef, inView: headerIn } = useInView({ threshold: 0.2 });
  const { ref: infoRef, inView: infoIn } = useInView({ threshold: 0.1 });
  const { ref: formRef, inView: formIn } = useInView({ threshold: 0.1 });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const autofillDemo = () => {
    setFormData(demoValues);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSubmittedTicket(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to submit inquiry ticket');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error while submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (submittedTicket?.ticketNumber) {
      navigator.clipboard.writeText(submittedTicket.ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData(demoValues);
    setErrorMsg('');
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div ref={headerRef} className={`contact-header reveal ${headerIn ? 'in-view' : ''}`}>
          <h1>Get In Touch</h1>
          <p>
            Have questions about our hostel facilities, room allotment, or admissions?
            Submit an official support ticket and our team will get back within 24 hours.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div ref={infoRef} className={`contact-info-card reveal-left ${infoIn ? 'in-view' : ''}`}>

            <h2>Contact Information</h2>
            <p>Reach out directly to the hostel administrative office or connect with us on our official profiles.</p>

            <a href="https://maps.google.com/?q=Shivaji+Nagar+Pune" target="_blank" rel="noopener noreferrer" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-info-icon">📍</div>
              <div className="contact-info-text">
                <strong>Campus Address</strong>
                <span>Hostel Office, Gate No. 2, Shivaji Nagar, Pune 411005</span>
              </div>
            </a>

            <a href="tel:+919876543210" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-info-icon">📞</div>
              <div className="contact-info-text">
                <strong>Official Helpline</strong>
                <span>+91 98765 43210</span>
              </div>
            </a>

            <a href="mailto:info@hostelmanage.in" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-info-icon">✉️</div>
              <div className="contact-info-text">
                <strong>Helpdesk Email</strong>
                <span>info@hostelmanage.in</span>
              </div>
            </a>

            <div className="contact-info-item">
              <div className="contact-info-icon">🕐</div>
              <div className="contact-info-text">
                <strong>Office Timings</strong>
                <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>

            <div className="contact-social-row">
              <a href="https://www.facebook.com/profile.php?id=61590433170519" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Facebook" title="Facebook">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="https://www.instagram.com/zxy_tanmay/" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Instagram" title="Instagram">
                <i className="bx bxl-instagram"></i>
              </a>
              <a href="https://x.com/Zxy_Tanmay" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Twitter (X)" title="Twitter (X)">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/tanmayrongre/" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="LinkedIn" title="LinkedIn">
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Form Card */}
          <div ref={formRef} className={`contact-form-card reveal-right ${formIn ? 'in-view' : ''}`}>

            {submittedTicket ? (
              <div style={{ textAlign: 'center', padding: '30px 16px' }} className="animate-fade-in">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: 22 }}>Inquiry Ticket Created!</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, maxWidth: 420, margin: '0 auto 16px' }}>
                  Thank you, <strong>{submittedTicket.firstName}</strong>. Your ticket has been logged into the hostel administrative database.
                </p>

                {/* Ticket Badge */}
                <div
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.35)',
                    borderRadius: 16,
                    padding: '16px 20px',
                    maxWidth: 360,
                    margin: '0 auto 20px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', fontWeight: 'bold' }}>
                      Reference Ticket No
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.2)', color: '#34d399', fontWeight: 'bold' }}>
                      Status: Open
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                    {submittedTicket.ticketNumber}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                    Category: {submittedTicket.inquiry?.toUpperCase()} • Email: {submittedTicket.email}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      padding: '8px',
                      borderRadius: 10,
                      background: copied ? '#059669' : '#1e1b4b',
                      border: '1px solid rgba(99,102,241,0.4)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <i className={`bx ${copied ? 'bx-check' : 'bx-copy'}`}></i>
                    {copied ? 'Copied to Clipboard!' : 'Copy Ticket ID'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h2 style={{ margin: 0 }}>Send an Official Inquiry</h2>
                  <button
                    type="button"
                    onClick={autofillDemo}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: '#818cf8',
                      fontSize: 11,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    title="Fill realistic demonstration details"
                  >
                    ✨ Demo Autofill
                  </button>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.35)',
                      color: '#fca5a5',
                      fontSize: 12,
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <i className="bx bx-error-circle" style={{ fontSize: 16 }}></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label>First Name *</label>
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
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="student@mountreach.edu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <label>Phone Number</label>
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
                    <label>Inquiry Category</label>
                    <select
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleChange}
                    >
                      <option value="general">General Campus Inquiry</option>
                      <option value="booking">Hostel Admission & Bed Allotment</option>
                      <option value="fees">Fee Dues & Payment Inquiries</option>
                      <option value="facilities">Mess & Room Facilities</option>
                      <option value="complaint">Complaint & Grievance</option>
                      <option value="other">Other Official Query</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label>Your Message *</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Please specify your query in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Logging Ticket...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-send" style={{ fontSize: 18 }}></i>
                        Submit Ticket
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