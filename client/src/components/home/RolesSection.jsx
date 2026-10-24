import React from 'react';
import { Link } from 'react-router-dom';
import useInView from '../../hooks/useInView';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Check,
  ArrowRight,
  Users
} from 'lucide-react';

const ROLES = [
  {
    cls: 'student',
    iconCls: 'gold',
    labelCls: 'gold',
    icon: <GraduationCap className="w-5 h-5" />,
    label: 'Resident Portal',
    title: 'Student Resident',
    desc: 'Empowering hostel residents with complete transparency — track room allotment, raise maintenance workorders, verify mess menus, and manage leaves digitally.',
    features: [
      'Digital room allotment letter & key tracking',
      'Instant maintenance workorders with status audit',
      'Daily curated nutritional mess menu schedules',
      'Digital gate-pass & outstation leave applications',
      'Semester fee dues & official receipt archives',
      'Campus residence announcements & safety alerts',
    ],
    cta: 'Enter Student Portal',
    link: '/login',
  },
  {
    cls: 'warden',
    iconCls: 'emerald',
    labelCls: 'emerald',
    icon: <Building2 className="w-5 h-5" />,
    label: 'Residence Desk',
    title: 'Hostel Warden',
    desc: 'Real-time operational command of your assigned residential block — approve outpasses, resolve grievances, audit QR attendance, and coordinate logistics.',
    features: [
      'Comprehensive block-wise room & occupancy register',
      'One-click outpass and multi-day leave authorizations',
      'Priority ticket resolution & technician assignment',
      'Automated nightly QR attendance reconciliation',
      'Block-specific notices & broadcast dispatches',
      'Immediate infrastructure failure escalation to Admin',
    ],
    cta: 'Enter Warden Desk',
    link: '/login',
  },
  {
    cls: 'admin-r',
    iconCls: 'slate',
    labelCls: 'slate',
    icon: <ShieldCheck className="w-5 h-5" />,
    label: 'Institutional Command',
    title: 'Campus Administrator',
    desc: 'Executive governance across the entire institutional residential ecosystem — multi-hostel allocation matrices, financial reconciliation, and warden controls.',
    features: [
      'Centralized block & floor configuration management',
      'Warden credential provisioning and accountability audit',
      'Institutional student residence directory & history',
      'Semester fee ledger & reconciliation analytics',
      'Comprehensive downloadable PDF/CSV audit reports',
      'Campus safety compliance & system-wide policies',
    ],
    cta: 'Enter Admin Hub',
    link: '/login',
  },
];

export default function RolesSection() {
  const { ref: headRef, inView: headIn } = useInView();
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.1 });

  return (
    <section className="lp-section lp-bg-a">
      <div className="lp-inner">
        <div ref={headRef} className={`lp-header-center reveal ${headIn ? 'in-view' : ''}`}>
          <div className="lp-tag">
            <Users className="w-3.5 h-3.5 text-[#dfba73]" />
            <span>Role-Scoped Architecture</span>
          </div>
          <h2 className="lp-heading">
            Tailored Experiences for <span>Every Campus Stakeholder</span>
          </h2>
          <p className="lp-sub">
            Three dedicated portals engineered to eliminate friction, paper registers,
            and administrative delays.
          </p>
        </div>

        <div ref={gridRef} className="roles-grid">
          {ROLES.map((r, i) => (
            <div
              key={r.cls}
              className={`role-card ${r.cls} reveal stagger-${i + 1} ${gridIn ? 'in-view' : ''}`}
            >
              <span className={`role-label ${r.labelCls}`}>{r.label}</span>
              <div className={`role-icon ${r.iconCls}`}>
                {r.icon}
              </div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <ul className="role-features">
                {r.features.map((f) => (
                  <li key={f}>
                    <span className={`role-check ${r.iconCls}`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to={r.link} className={`role-cta ${r.iconCls}`}>
                <span>{r.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
