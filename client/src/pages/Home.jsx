import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';
import '../styles/LandingSections.css';

/* ─── DATA ───────────────────────────────────────── */

const ROLES = [
  {
    cls: 'student',
    iconCls: 'blue',
    labelCls: 'blue',
    icon: '🎓',
    label: 'Student Portal',
    title: 'Student',
    desc: 'Manage your hostel life from a single dashboard — apply for a room, track complaints, view mess menu, request outpass, and stay connected.',
    features: [
      'Apply & track room allotment',
      'Raise & monitor complaints',
      'View daily mess menu',
      'Request outpass / leave',
      'Fee dues & payment history',
      'Notice board & announcements',
    ],
    ctaLabel: 'Student Login →',
    ctaCls: 'blue',
  },
  {
    cls: 'warden',
    iconCls: 'green',
    labelCls: 'green',
    icon: '🏫',
    label: 'Warden Dashboard',
    title: 'Warden',
    desc: 'Oversee your hostel block with real-time tools — manage room allotments, approve outpass requests, handle student complaints, and coordinate with admin.',
    features: [
      'Manage room allotments',
      'Approve / reject outpass',
      'Resolve student complaints',
      'Track attendance by floor',
      'Post block-level notices',
      'Report maintenance issues',
    ],
    ctaLabel: 'Warden Login →',
    ctaCls: 'green',
  },
  {
    cls: 'admin-r',
    iconCls: 'amber',
    labelCls: 'amber',
    icon: '🛡️',
    label: 'Admin Panel',
    title: 'Admin',
    desc: 'Full control over the entire hostel campus — manage wardens, allocate rooms across blocks, oversee fees, generate reports, and configure the system.',
    features: [
      'Manage all hostel blocks & rooms',
      'Add / manage wardens',
      'Oversee all student records',
      'Global fee collection overview',
      'Analytics & downloadable reports',
      'System-wide settings & roles',
    ],
    ctaLabel: 'Admin Login →',
    ctaCls: 'amber',
  },
];

const FEATURES = [
  { icon: '🏠', title: 'Room Allotment & Management', desc: 'Automated room allocation based on preferences, gender, and availability across all blocks.' },
  { icon: '📋', title: 'Complaint & Grievance System', desc: 'Students raise issues; wardens resolve them. Track status from submitted to resolved.' },
  { icon: '🍱', title: 'Mess & Meal Management', desc: 'Weekly mess menu, meal tracking, special dietary requests, and mess feedback system.' },
  { icon: '🔑', title: 'Outpass & Leave Requests', desc: 'Digital outpass approval — students apply, wardens approve, admin monitors.' },
  { icon: '📊', title: 'Attendance Monitoring', desc: 'Floor-wise and block-wise daily attendance tracking with defaulter reports.' },
  { icon: '💳', title: 'Fee & Payment Tracking', desc: 'Hostel fee dues, payment history, receipt generation, and fine management.' },
  { icon: '📢', title: 'Notice Board & Alerts', desc: 'Instant announcements pushed to students — block-level or campus-wide.' },
  { icon: '🛠️', title: 'Maintenance Requests', desc: 'Report electrical, plumbing, or furniture issues and track repair progress.' },
];

const STEPS = [
  {
    n: '01',
    title: 'Register & Get Onboarded',
    desc: 'Students register with their enrollment ID. Admin verifies and assigns them to a hostel block with a room allotment letter.',
  },
  {
    n: '02',
    title: 'Access Your Role Dashboard',
    desc: 'Login with your credentials. Students, Wardens, and Admins each see a personalized dashboard with role-specific tools and data.',
  },
  {
    n: '03',
    title: 'Manage Everything Digitally',
    desc: 'No paper. Raise complaints, approve outpass, view mess menu, pay fees, and download reports — all from one platform.',
  },
];

const STATS = [
  { value: '2,400+', label: 'Students Managed' },
  { value: '12', label: 'Hostel Blocks' },
  { value: '850+', label: 'Rooms Tracked' },
  { value: '98%', label: 'Complaint Resolution Rate' },
];

const FOOTER_PORTAL = ['Student Login', 'Warden Login', 'Admin Panel', 'Register as Student', 'Reset Password'];
const FOOTER_HMS = ['Room Allotment', 'Mess Schedule', 'Outpass Request', 'Complaint Portal', 'Fee Payment'];
const FOOTER_SUPPORT = ['FAQ', 'Hostel Rules & Regulations', 'Privacy Policy', 'Terms of Service', 'Grievance Portal'];

/* ─── COMPONENT ──────────────────────────────────── */
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_60%_30%,rgba(99,102,241,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(14,165,233,0.08)_0%,transparent_50%)]">
      <div className="text-center max-w-2xl animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent mb-6">
          MountReach 2026 🏔️
        </h1>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Hackathon project is ready. Waiting for the problem statement...
        </p>
        <div className="inline-block px-5 py-2 bg-background-card border border-slate-800 rounded-full text-sm text-slate-400 tracking-wide">
          🚀 MERN Stack · React + Vite · Express . Mongodb
        </div>
      </div>

      {/* ════════════════════════════════════════
          SECTION 1 — ROLE CARDS
          ════════════════════════════════════════ */}
      <section className="lp-section lp-bg-a">
        <div className="lp-inner">
          <div className="lp-header-center">
            <div className="lp-tag"><i className="bx bx-group" style={{ fontSize: 12 }}></i>User Roles</div>
            <h2 className="lp-heading">One Platform, <span>Three Powerful Portals</span></h2>
            <p className="lp-sub">Every user gets a tailored dashboard with exactly what they need — nothing more, nothing less.</p>
          </div>

          <div className="roles-grid">
            {ROLES.map((r) => (
              <div key={r.cls} className={`role-card ${r.cls}`}>
                <span className={`role-label ${r.labelCls}`}>{r.label}</span>
                <div className={`role-icon ${r.iconCls}`}>
                  <span role="img" aria-label={r.title}>{r.icon}</span>
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <ul className="role-features">
                  {r.features.map((f) => (
                    <li key={f}>
                      <span className={`role-check ${r.iconCls}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`role-cta ${r.ctaCls}`}>
                  <i className="bx bx-log-in-circle" style={{ fontSize: 15 }}></i>
                  {r.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — FEATURES
          ════════════════════════════════════════ */}
      <section className="lp-section lp-bg-b">
        <div className="lp-inner">
          <div className="lp-header-center">
            <div className="lp-tag"><i className="bx bx-grid-alt" style={{ fontSize: 12 }}></i>Features</div>
            <h2 className="lp-heading">Everything You Need to Run a <span>Modern Hostel</span></h2>
            <p className="lp-sub">From room allocation to mess management — every hostel operation, digitized and streamlined.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <span role="img" aria-label={f.title}>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
          ════════════════════════════════════════ */}
      <section className="lp-section lp-bg-a">
        <div className="lp-inner">
          <div className="lp-header-center">
            <div className="lp-tag"><i className="bx bx-list-check" style={{ fontSize: 12 }}></i>Getting Started</div>
            <h2 className="lp-heading">Up & Running in <span>3 Simple Steps</span></h2>
            <p className="lp-sub">From registration to full digital hostel management — onboarding is fast and straightforward.</p>
          </div>
          <div className="hiw-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — STATS
          ════════════════════════════════════════ */}
      <section className="lp-section lp-bg-b">
        <div className="lp-inner">
          <div className="lp-header-center" style={{ marginBottom: 48 }}>
            <div className="lp-tag"><i className="bx bx-bar-chart-alt-2" style={{ fontSize: 12 }}></i>Impact</div>
            <h2 className="lp-heading">Trusted by Colleges, <span>Loved by Students</span></h2>
            <p className="lp-sub">Real numbers from real hostel campuses using HostelHub.</p>
          </div>
          <div className="stats-strip">
            {STATS.map((s, i) => (
              <div key={i} className="stat-block">
                <div className="stat-block-value">{s.value}</div>
                <div className="stat-block-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — CTA
          ════════════════════════════════════════ */}
      <section className="lp-section lp-bg-c">
        <div className="lp-inner">
          <div className="cta-banner">
            <h2>Ready to <span style={{
              background: 'linear-gradient(135deg,#818cf8,#a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Digitise Your Hostel?</span></h2>
            <p>Replace paper registers, manual attendance, and phone-based complaints with one smart platform built for college hostels.</p>
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

      {/* ════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════ */}
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
                  <a key={ic} href="#" className="footer-social-btn" onClick={(e) => e.preventDefault()}>
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
                      <i className="bx bx-chevron-right" style={{ color: '#6366f1', fontSize: 16 }}></i>{l}
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
                      <i className="bx bx-chevron-right" style={{ color: '#6366f1', fontSize: 16 }}></i>{l}
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
            <span className="footer-copyright">© 2026 HostelHub — College Hostel Management System. All rights reserved.</span>
            <div className="footer-bottom-links">
              {FOOTER_SUPPORT.slice(2).map((l) => (
                <a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
