import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const POLICY_CONTENT = {
  'Hostel Rules & Regulations': [
    'Gate timings: Main entry gates close strictly at 10:00 PM on weekdays and 10:30 PM on weekends.',
    'Leave permissions: Overnight or multi-day leaves must be applied online and approved by the Warden.',
    'Room discipline: Electrical cooking appliances, heaters, and unauthorized guests are strictly prohibited.',
    'Quiet hours: 10:00 PM to 6:00 AM are observed as campus quiet hours for study and rest.',
  ],
  'Privacy Policy': [
    'Student data protection: Resident identity, contact, and family records are encrypted and role-scoped.',
    'No third-party sharing: Resident information is strictly used for campus accommodation and safety purposes.',
    'Session security: JWT authentication with secure HTTP-only cookies and automatic session timeouts.',
  ],
  'Terms of Service': [
    'Admission terms: Room and bed allocations are subject to semester fee clearance and college verification.',
    'Code of conduct: Residents must abide by college anti-ragging laws and institutional standards.',
    'Maintenance: Room fixtures must be maintained responsibly; damages are subject to caution deposit deductions.',
  ],
};

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const portalLinks = [
    { label: 'Student Portal', to: '/dashboard' },
    { label: 'Warden Portal', to: '/warden' },
    { label: 'Admin Portal', to: '/admin' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand & Socials */}
          <div>
            <Link to="/" className="footer-brand-logo" style={{ textDecoration: 'none' }}>
              <div className="footer-logo-icon">
                <i className="bx bx-building-house"></i>
              </div>
              <div>
                <div className="footer-brand-name">HostelHub</div>
                <span className="footer-brand-tag">College Hostel Management</span>
              </div>
            </Link>
            <p className="footer-tagline">
              A modern, role-based hostel management platform for colleges.
              Empowering students, wardens, and administrators with seamless digital tools.
            </p>
            <div className="footer-social-row">
              <a
                href="https://www.instagram.com/zxy_tanmay/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
                title="Instagram"
              >
                <i className="bx bxl-instagram"></i>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590433170519"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
                title="Facebook"
              >
                <i className="bx bxl-facebook"></i>
              </a>
              <a
                href="https://x.com/Zxy_Tanmay"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="X (Twitter)"
                title="X (Twitter)"
              >
                <i className="bx bxl-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/tanmayrongre/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Portals */}
          <div>
            <div className="footer-col-title">Portals</div>
            <ul className="footer-links">
              {portalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bx bx-chevron-right" style={{ color: '#6366f1', fontSize: 16 }}></i>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HMS Available Features */}
          <div>
            <div className="footer-col-title">HMS Available Features</div>
            <ul className="footer-features-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Smart Room & Bed Allotment',
                'Online Leave Applications',
                '24/7 Grievance & Complaints',
              ].map((feat) => (
                <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}>
                    ✓
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact & Support</div>
            <a href="tel:+919876543210" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i className="bx bx-phone footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Hostel Office</strong>
                +91 98765 43210
              </div>
            </a>
            <a href="mailto:info@hostelmanage.in" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i className="bx bx-envelope footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Support Email</strong>
                info@hostelmanage.in
              </div>
            </a>
            <Link to="/contact" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i className="bx bx-map-pin footer-contact-icon"></i>
              <div className="footer-contact-text">
                <strong>Campus Address</strong>
                Hostel Office, Gate No. 2,<br />College Campus, Pune 411005
              </div>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © 2026 HostelHub — College Hostel Management System. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <button
              onClick={() => setActiveModal('Hostel Rules & Regulations')}
              className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-xs"
            >
              Hostel Rules
            </button>
            <button
              onClick={() => setActiveModal('Privacy Policy')}
              className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-xs"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveModal('Terms of Service')}
              className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-xs"
            >
              Terms of Service
            </button>
            <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-xs" style={{ textDecoration: 'none' }}>
              Help Desk
            </Link>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE POLICY & RULES MODAL ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0f1b2d] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold">
                  📜
                </div>
                <h3 className="text-base font-bold text-white">{activeModal}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-2">
              {POLICY_CONTENT[activeModal]?.map((rule, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
