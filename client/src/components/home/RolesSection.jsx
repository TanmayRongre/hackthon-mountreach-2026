import React from 'react';

const ROLES = [
  {
    cls: 'student',
    iconCls: 'blue',
    labelCls: 'blue',
    icon: '🎓',
    label: 'Student Portal',
    title: 'Student',
    desc: 'Manage your hostel life from a single dashboard — apply for a room, track complaints, view mess menu, submit leave applications, and stay connected.',
    features: [
      'Apply & track room allotment',
      'Raise & monitor complaints',
      'View daily mess menu',
      'Submit leave application',
      'Fee dues & payment history',
      'Notice board & announcements',
    ],
  },
  {
    cls: 'warden',
    iconCls: 'green',
    labelCls: 'green',
    icon: '🏫',
    label: 'Warden Dashboard',
    title: 'Warden',
    desc: 'Oversee your hostel block with real-time tools — manage room allotments, approve leave applications, handle student complaints, and coordinate with admin.',
    features: [
      'Manage room allotments',
      'Approve / reject leave applications',
      'Resolve student complaints',
      'Track attendance by floor',
      'Post block-level notices',
      'Report maintenance issues',
    ],
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
  },
];

export default function RolesSection() {
  return (
    <section className="lp-section lp-bg-a">
      <div className="lp-inner">
        <div className="lp-header-center">
          <div className="lp-tag">
            <i className="bx bx-group" style={{ fontSize: 12 }}></i>User Roles
          </div>
          <h2 className="lp-heading">
            One Platform, <span>Three Powerful Portals</span>
          </h2>
          <p className="lp-sub">
            Every user gets a tailored dashboard with exactly what they need — nothing more, nothing less.
          </p>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
