import React from 'react';
import useInView from '../../hooks/useInView';

const STATS = [
  { value: '2,400+', label: 'Students Managed' },
  { value: '12', label: 'Hostel Blocks' },
  { value: '850+', label: 'Rooms Tracked' },
  { value: '98%', label: 'Complaint Resolution Rate' },
];

export default function StatsSection() {
  const { ref: headRef, inView: headIn } = useInView();
  const { ref: stripRef, inView: stripIn } = useInView({ threshold: 0.2 });

  return (
    <section className="lp-section lp-bg-b">
      <div className="lp-inner">
        <div ref={headRef} className={`lp-header-center reveal ${headIn ? 'in-view' : ''}`} style={{ marginBottom: 48 }}>
          <div className="lp-tag">
            <i className="bx bx-bar-chart-alt-2" style={{ fontSize: 12 }}></i>Impact
          </div>
          <h2 className="lp-heading">
            Trusted by Colleges, <span>Loved by Students</span>
          </h2>
          <p className="lp-sub">Real numbers from real hostel campuses using HostelHub.</p>
        </div>
        <div ref={stripRef} className="stats-strip">
          {STATS.map((s, i) => (
            <div key={i} className={`stat-block reveal stagger-${i + 1} ${stripIn ? 'in-view' : ''}`}>
              <div className="stat-block-value">{s.value}</div>
              <div className="stat-block-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
