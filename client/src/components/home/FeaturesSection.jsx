import React from 'react';
import useInView from '../../hooks/useInView';
import {
  Building2,
  ClipboardList,
  UtensilsCrossed,
  KeyRound,
  Activity,
  CreditCard,
  Megaphone,
  Wrench,
  Grid
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Building2 className="w-4 h-4" />,
    title: 'Room Allotment & Bed Registry',
    desc: 'Automated room allocation matrices based on branch, year, gender, and preference across all residential blocks.'
  },
  {
    icon: <ClipboardList className="w-4 h-4" />,
    title: 'Maintenance & Grievance Tickets',
    desc: 'Students file tickets with photographs; wardens track SLA response and resolve with verifiable completion logs.'
  },
  {
    icon: <UtensilsCrossed className="w-4 h-4" />,
    title: 'Nutritional Mess & Dining Schedules',
    desc: 'Weekly 4-meal cycle schedules, dietary feedback channels, and real-time meal timing notifications.'
  },
  {
    icon: <KeyRound className="w-4 h-4" />,
    title: 'Digital Gate-Pass & Outstation Leaves',
    desc: 'End-to-end paperless leave workflows — instant parent SMS verification, warden signatures, and security gate logs.'
  },
  {
    icon: <Activity className="w-4 h-4" />,
    title: 'Automated QR Night Attendance',
    desc: 'Floor-by-floor geolocation-verified QR roll calls with instant absent alerts to resident wardens.'
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    title: 'Institutional Fee Accounting',
    desc: 'Digital semester fee collection, instant downloadable tax receipts, dues reconciliation, and caution deposits.'
  },
  {
    icon: <Megaphone className="w-4 h-4" />,
    title: 'Instant Broadcast Dispatcher',
    desc: 'Segmented announcements pushed directly to resident portals — block-specific or entire campus-wide.'
  },
  {
    icon: <Wrench className="w-4 h-4" />,
    title: 'Campus Facility Operations',
    desc: 'Centralized preventive maintenance tracking for high-speed Wi-Fi, plumbing, electrical fixtures, and gym amenities.'
  },
];

export default function FeaturesSection() {
  const { ref: headRef, inView: headIn } = useInView();
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.08 });

  return (
    <section className="lp-section lp-bg-b">
      <div className="lp-inner">
        <div ref={headRef} className={`lp-header-center reveal ${headIn ? 'in-view' : ''}`}>
          <div className="lp-tag">
            <Grid className="w-3.5 h-3.5 text-[#dfba73]" />
            <span>Operational Capabilities</span>
          </div>
          <h2 className="lp-heading">
            Enterprise Architecture for <span>Modern Residences</span>
          </h2>
          <p className="lp-sub">
            From algorithmic room allotments to QR night audits — every campus living operation digitized with precision.
          </p>
        </div>
        <div ref={gridRef} className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`feature-card reveal-scale stagger-${i + 1} ${gridIn ? 'in-view' : ''}`}
            >
              <div className="feature-icon">
                {f.icon}
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
