import React from 'react';

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
    desc: 'No paper. Raise complaints, approve leave applications, view mess menu, pay fees, and download reports — all from one platform.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="lp-section lp-bg-a">
      <div className="lp-inner">
        <div className="lp-header-center">
          <div className="lp-tag">
            <i className="bx bx-list-check" style={{ fontSize: 12 }}></i>Getting Started
          </div>
          <h2 className="lp-heading">
            Up & Running in <span>3 Simple Steps</span>
          </h2>
          <p className="lp-sub">
            From registration to full digital hostel management — onboarding is fast and straightforward.
          </p>
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
  );
}
