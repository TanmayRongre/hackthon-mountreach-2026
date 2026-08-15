import React from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assests/Video.mp4';

export default function HeroSection() {
  return (
    <div className="home-page">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="home-hero-video"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
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
              leave applications, and more — completely paperless.
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
        </div>

        {/* ── Right column: floating cards ── */}
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
                Rooms, complaints, mess, leave applications &amp; fees — one secure platform.
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
  );
}
