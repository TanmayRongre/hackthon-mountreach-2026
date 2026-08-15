import React from 'react';

const FOOTER_PORTAL = ['Student Login', 'Warden Login', 'Admin Panel', 'Register as Student', 'Reset Password'];
const FOOTER_HMS = ['Room Allotment', 'Mess Schedule', 'Outpass Request', 'Complaint Portal', 'Fee Payment'];
const FOOTER_SUPPORT = ['FAQ', 'Hostel Rules & Regulations', 'Privacy Policy', 'Terms of Service', 'Grievance Portal'];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <div className="footer-logo-icon">
                <i className="bx bx-building-house"></i>
              </div>
              <div>
                <div className="footer-brand-name">HostelHub</div>
                <span className="footer-brand-tag">College Hostel Management</span>
              </div>
            </div>
            <p className="footer-tagline">
              A modern, role-based hostel management platform for colleges.
              Empowering students, wardens, and administrators with seamless digital tools.
            </p>
            <div className="footer-social-row">
              {['bxl-instagram', 'bxl-facebook', 'bxl-twitter', 'bxl-linkedin'].map((ic) => (
                <a
                  key={ic}
                  href="#"
                  className="footer-social-btn"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Social Link"
                >
                  <i className={`bx ${ic}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Portals */}
          <div>
            <div className="footer-col-title">Portals</div>
            <ul className="footer-links">
              {FOOTER_PORTAL.map((l) => (
                <li key={l}>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="bx bx-chevron-right" style={{ color: '#6366f1', fontSize: 16 }}></i>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HMS */}
          <div>
            <div className="footer-col-title">HMS Features</div>
            <ul className="footer-links">
              {FOOTER_HMS.map((l) => (
                <li key={l}>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="bx bx-chevron-right" style={{ color: '#6366f1', fontSize: 16 }}></i>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact & Support</div>
            <div className="footer-contact-item">
              <i className="bx bx-phone footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Hostel Office</strong>
                +91 98765 43210
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="bx bx-envelope footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Support Email</strong>
                hostel@campus.edu.in
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="bx bx-map-pin footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Campus Address</strong>
                Hostel Office, Gate No. 2,<br />College Campus, Pune 411005
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © 2026 HostelHub — College Hostel Management System. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            {FOOTER_SUPPORT.slice(2).map((l) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
