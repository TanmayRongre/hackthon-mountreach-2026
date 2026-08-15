import React from 'react';
import { Link } from 'react-router-dom';

export default function CtaSection() {
  return (
    <section className="lp-section lp-bg-c">
      <div className="lp-inner">
        <div className="cta-banner">
          <h2>
            Ready to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#818cf8,#a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Digitise Your Hostel?
            </span>
          </h2>
          <p>
            Replace paper registers, manual attendance, and phone-based complaints with one smart platform built for college hostels.
          </p>
          <div className="cta-btn-row">
            <Link to="/register" className="cta-btn-primary">
              <i className="bx bx-user-plus" style={{ fontSize: 18 }}></i>
              Register as Student
            </Link>
            <Link to="/login" className="cta-btn-secondary">
              <i className="bx bx-log-in-circle" style={{ fontSize: 18 }}></i>
              Login to Your Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
