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
  UserPlus
} from 'lucide-react';

export default function UnadmittedView({ user, onOpenAdmission }) {
  const lockedFeatures = [
    {
      icon: <Building2 className="w-6 h-6 text-indigo-400" />,
      title: 'Digital Room & Bed Allotment',
      desc: 'Get allotted to an AC/Non-AC room with dedicated bed ID, floor details, and roommates directory.',
      tag: 'Admission Required',
    },
    {
      icon: <Key className="w-6 h-6 text-sky-400" />,
      title: 'Online Leave Applications & Gatepass',
      desc: 'Apply for day leaves, weekend visits, or vacation permissions with digital Warden e-signatures.',
      tag: 'Admission Required',
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-emerald-400" />,
      title: 'Mess Schedule & Meal Tracking',
      desc: 'View weekly 7-day breakfast, lunch, snacks & dinner menu and submit dietary preferences.',
      tag: 'Admission Required',
    },
    {
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      title: 'Grievance & Complaint Portal',
      desc: 'Raise electrical, plumbing, Wi-Fi, or furniture issues directly to hostel wardens with live status.',
      tag: 'Admission Required',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-rose-400" />,
      title: 'Fee Dues & Instant Receipts',
      desc: 'Pay semester hostel and mess dues via UPI/cards and instantly download verified tax receipts.',
      tag: 'Admission Required',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: 'Floor Attendance & Smart Access',
      desc: 'Digital check-in records, night curfew alerts, and floor attendance tracking.',
      tag: 'Admission Required',
    },
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in">
      {/* Hero Admission Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121f36] via-[#0f1b2d] to-[#0a1424] border border-indigo-500/20 shadow-2xl p-8 md:p-12">
        {/* Glow ambient circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Hostel Resident Onboarding · 2026
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Welcome, <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">{user?.name || 'Student'}</span>!
              <br />
              Complete Your <span className="text-indigo-400">Hostel Admission</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300/80 leading-relaxed max-w-2xl">
              You are currently registered as a student user. To access room allotment, mess schedules, leave applications, fee management, and complaint resolution, please complete your hostel admission.
            </p>
          </div>

          {/* Key Checklist Pill */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Room Assignment</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paperless Verification</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>24/7 Digital Portal Access</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>Admit Now / Apply for Admission</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Takes less than 1 minute to fill
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Features Unlocked After Admission</h2>
            <p className="text-xs text-slate-400 mt-1">
              Here is everything you will be able to manage once your admission is confirmed.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            6 Campus Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lockedFeatures.map((feat, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {feat.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{feat.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  🔒 Locked
                </span>
                <button
                  onClick={onOpenAdmission}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>Admit to unlock</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
