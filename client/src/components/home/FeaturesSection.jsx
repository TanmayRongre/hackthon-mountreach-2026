import React from 'react';

const FEATURES = [
  { icon: '🏠', title: 'Room Allotment & Management', desc: 'Automated room allocation based on preferences, gender, and availability across all blocks.' },
  { icon: '📋', title: 'Complaint & Grievance System', desc: 'Students raise issues; wardens resolve them. Track status from submitted to resolved.' },
  { icon: '🍱', title: 'Mess & Meal Management', desc: 'Weekly mess menu, meal tracking, special dietary requests, and mess feedback system.' },
  { icon: '🔑', title: 'Leave Applications & Clearances', desc: 'Digital leave approval — students apply, wardens approve, admin monitors.' },
  { icon: '📊', title: 'Attendance Monitoring', desc: 'Floor-wise and block-wise daily attendance tracking with defaulter reports.' },
  { icon: '💳', title: 'Fee & Payment Tracking', desc: 'Hostel fee dues, payment history, receipt generation, and fine management.' },
  { icon: '📢', title: 'Notice Board & Alerts', desc: 'Instant announcements pushed to students — block-level or campus-wide.' },
  { icon: '🛠️', title: 'Maintenance Requests', desc: 'Report electrical, plumbing, or furniture issues and track repair progress.' },
];

export default function FeaturesSection() {
  return (
    <section className="lp-section lp-bg-b">
      <div className="lp-inner">
        <div className="lp-header-center">
          <div className="lp-tag">
            <i className="bx bx-grid-alt" style={{ fontSize: 12 }}></i>Features
          </div>
          <h2 className="lp-heading">
            Everything You Need to Run a <span>Modern Hostel</span>
          </h2>
          <p className="lp-sub">
            From room allocation to mess management — every hostel operation, digitized and streamlined.
          </p>
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
  );
}
