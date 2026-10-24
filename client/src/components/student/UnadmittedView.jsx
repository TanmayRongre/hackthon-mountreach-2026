import React from 'react';
import {
  Sparkles,
  Building2,
  Key,
  ShieldCheck,
  UtensilsCrossed,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  Lock
} from 'lucide-react';

export default function UnadmittedView({ user, onOpenAdmission }) {
  const lockedFeatures = [
    {
      icon: <Building2 className="w-5 h-5 text-[#dfba73]" />,
      title: 'Digital Room & Bed Allotment',
      desc: 'Get allotted to an AC/Non-AC room with dedicated bed ID, floor details, and roommates directory.',
      tag: 'Admission Required',
    },
    {
      icon: <Key className="w-5 h-5 text-emerald-400" />,
      title: 'Online Leave Applications & Gatepass',
      desc: 'Apply for day leaves, weekend visits, or vacation permissions with digital Warden e-signatures.',
      tag: 'Admission Required',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-[#dfba73]" />,
      title: 'Hostel Dining & Weekly Meal Tracker',
      desc: 'Live 7-day breakfast, lunch, snacks, and dinner schedules, calorie insights, and mess leave rebates.',
      tag: 'Admission Required',
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      title: 'Grievance & Complaint Portal',
      desc: 'Raise electrical, plumbing, Wi-Fi, or furniture issues directly to hostel wardens with live status.',
      tag: 'Admission Required',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-rose-400" />,
      title: 'Fee Dues & Instant Receipts',
      desc: 'Pay semester hostel and mess dues via UPI/cards and instantly download verified tax receipts.',
      tag: 'Admission Required',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />,
      title: 'Floor Attendance & Smart Access',
      desc: 'Digital check-in records, night curfew alerts, and floor attendance tracking.',
      tag: 'Admission Required',
    },
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in font-sans">
      {/* Hero Admission Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1219] border border-white/[0.09] shadow-2xl p-8 md:p-12">
        {/* Subtle warm glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#c5a059]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#c5a059]/10 border border-[#c5a059]/25 text-xs font-semibold text-[#dfba73] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#dfba73]" />
            <span>Hostel Resident Onboarding · 2026</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Welcome, <span className="gold-gradient-text">{user?.name || 'Student'}</span>!
              <br />
              Complete Your <span className="text-[#dfba73] italic">Hostel Admission</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              You are currently registered as a resident applicant. To access room allotment, mess schedules, leave applications, fee management, and complaint resolution, please complete your hostel admission dossier.
            </p>
          </div>

          {/* Key Checklist Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-[#141824] px-3 py-1.5 rounded-md border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Room Assignment</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#141824] px-3 py-1.5 rounded-md border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paperless Verification</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#141824] px-3 py-1.5 rounded-md border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>24/7 Digital Portal Access</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="px-6 py-3 rounded-md bg-[#c5a059] hover:bg-[#dfba73] text-[#090b10] font-semibold text-sm shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#090b10]" />
              <span>Admit Now / Complete Admission</span>
              <ArrowRight className="w-4 h-4 text-[#090b10]" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
              Takes less than 1 minute to fill
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-white tracking-tight">Features Unlocked After Admission</h2>
            <p className="text-xs text-slate-400 mt-1">
              Everything you will be able to manage once your admission is verified.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#141824] text-[#dfba73] border border-white/[0.08]">
            6 Campus Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lockedFeatures.map((feat, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-xl bg-[#121620] hover:bg-[#161b28] border border-white/[0.08] hover:border-[#c5a059]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-[#182030] border border-white/[0.06] group-hover:border-[#c5a059]/30 transition-all">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                    {feat.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-[#dfba73] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{feat.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Admission Restricted</span>
                </span>
                <button
                  onClick={onOpenAdmission}
                  className="text-xs font-medium text-[#dfba73] hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Unlock module</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
