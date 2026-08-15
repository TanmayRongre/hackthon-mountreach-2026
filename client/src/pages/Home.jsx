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
    <>
      {/* ════════════════════════════════════════
          HERO — full-viewport
          ════════════════════════════════════════ */}
      <div className="home-page">
        <div className="home-hero-bg" />
        <div className="home-hero-overlay" />

        <div className="home-layout">
          {/* ── Left column ── */}
          <div className="home-left-col">
            <div className="home-hero-content">
              <div className="home-badge">
                <i className="bx bx-building-house" style={{ fontSize: 13 }}></i>
                College Hostel Management System · 2026
              </div>

              <h1>
                Smart Hostel<br />
                <span>Management</span><br />
                for Colleges
              </h1>

              <p className="home-hero-desc">
                A unified digital platform for Students, Wardens, and Admins.
                Streamline room allotments, complaints, mess management,
                outpass requests, and more — completely paperless.
              </p>

              <div className="home-cta-row">
                <Link to="/login" className="home-cta-primary">
                  <i className="bx bx-log-in-circle" style={{ fontSize: 18 }}></i>
                  Login to Your Portal
                </Link>
                <Link to="/register" className="home-cta-secondary">
                  <i className="bx bx-user-plus" style={{ fontSize: 18 }}></i>
                  Register as Student
                </Link>
              </div>

              <div className="home-stats-row">
                <div className="home-stat-item">
                  <span className="home-stat-value">2,400+</span>
                  <span className="home-stat-label">Students</span>
                </div>
                <div className="home-stat-sep" />
                <div className="home-stat-item">
                  <span className="home-stat-value">12</span>
                  <span className="home-stat-label">Hostel Blocks</span>
                </div>
                <div className="home-stat-sep" />
                <div className="home-stat-item">
                  <span className="home-stat-value">3</span>
                  <span className="home-stat-label">User Roles</span>
                </div>
              </div>
            </div>

            {/* Left col ends here — hero content only */}
          </div>

          {/* ── Right column: BOTH cards side by side at bottom ── */}
          <div className="home-right-col">
            <div className="home-cards-row">

              {/* Card 1 — Portals */}
              <div className="home-card-left">
                <h3>3 Role Portals</h3>
                <p>One platform, three tailored dashboards.</p>
                <div className="home-card-left-footer">
                  <div>
                    <div className="home-stat-big">100%</div>
                    <div className="home-stat-tiny">Paperless</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="home-card-avatars">
                      <div className="home-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }} title="Student">S</div>
                      <div className="home-avatar" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }} title="Warden">W</div>
                      <div className="home-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }} title="Admin">A</div>
                    </div>
                    <Link to="/login" className="home-card-go-btn" title="Login">→</Link>
                  </div>
                </div>
              </div>

              {/* Card 2 — Portal info */}
              <div className="home-card-right">
                <div className="home-card-header">
                  <div>
                    <div className="home-card-title">HostelHub Portal</div>
                    <div className="home-card-addr">
                      <i className="bx bx-map-pin" style={{ fontSize: 12 }}></i>
                      Campus College, Pune
                    </div>
                  </div>
                  <Link to="/login" className="home-card-go-btn" title="Go to portal">→</Link>
                </div>
                <div className="home-card-badge">
                  <i className="bx bxs-check-circle" style={{ fontSize: 11 }}></i>
                  System Active
                </div>
                <p className="home-card-desc">
                  Rooms, complaints, mess, outpass &amp; fees — one secure platform.
                </p>
                <div className="home-card-specs">
                  <div className="home-card-spec">
                    <i className="bx bx-user" style={{ color: '#818cf8' }}></i>Student
                  </div>
                  <div className="home-card-spec-sep" />
                  <div className="home-card-spec">
                    <i className="bx bx-id-card" style={{ color: '#818cf8' }}></i>Warden
                  </div>
                  <div className="home-card-spec-sep" />
                  <div className="home-card-spec">
                    <i className="bx bx-shield" style={{ color: '#818cf8' }}></i>Admin
                  </div>
                </div>
              </div>

            </div>
          </div>
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
    </>
  );
}
