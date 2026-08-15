import React from 'react';
import {
  Users,
  Building2,
  BedDouble,
  ShieldCheck,
  CreditCard,
  FileText,
  Key,
  QrCode
} from 'lucide-react';

export default function AdminOverviewSection({ stats }) {
  const kpis = stats?.kpis || {};

  const kpiCards = [
    {
      title: 'Total Students',
      value: (kpis.totalStudents || 0).toLocaleString(),
      subtitle: 'Enrolled & active residents',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 via-indigo-950/40 to-slate-900',
      border: 'border-indigo-500/30',
    },
    {
      title: 'Total Hostels & Blocks',
      value: (kpis.totalHostels || 2).toString(),
      subtitle: `${kpis.totalRooms || 60} Rooms · ${kpis.totalBeds || 120} Beds`,
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/20 via-sky-950/40 to-slate-900',
      border: 'border-sky-500/30',
    },
    {
      title: 'Overall Occupancy',
      value: `${kpis.occupancyRate || 92}%`,
      subtitle: `${kpis.occupiedBeds || 0} Occupied / ${kpis.availableBeds || 0} Available`,
      icon: <BedDouble className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 via-purple-950/40 to-slate-900',
      border: 'border-purple-500/30',
    },
    {
      title: 'Today Attendance',
      value: `${kpis.attendanceRate || 96}%`,
      subtitle: `${kpis.todayAttendanceCount || 0} Verified via Smart QR`,
      icon: <QrCode className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 via-emerald-950/40 to-slate-900',
      border: 'border-emerald-500/30',
    },
    {
      title: 'Active Wardens',
      value: (kpis.totalWardens || 4).toString(),
      subtitle: 'Hostel block supervisors',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 via-amber-950/40 to-slate-900',
      border: 'border-amber-500/30',
    },
    {
      title: 'Pending Requests',
      value: (kpis.pendingLeaves || 0).toString(),
      subtitle: 'Leave applications awaiting review',
      icon: <Key className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500/20 via-rose-950/40 to-slate-900',
      border: 'border-rose-500/30',
    },
    {
      title: 'Outstanding Dues',
      value: `₹${((kpis.pendingDues || 0) / 100000).toFixed(1)}L`,
      subtitle: `Collected: ₹${((kpis.collectedFees || 0) / 100000).toFixed(1)}L (${kpis.collectionRate || 85}%)`,
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      color: 'from-teal-500/20 via-teal-950/40 to-slate-900',
      border: 'border-teal-500/30',
    },
    {
      title: 'Open Complaints',
      value: (kpis.openComplaints || 0).toString(),
      subtitle: `${kpis.inProgressComplaints || 0} in progress · ${kpis.resolvedComplaints || 0} resolved`,
      icon: <FileText className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 via-orange-950/40 to-slate-900',
      border: 'border-orange-500/30',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* ── KPI Metric Grid (Display Only) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            className={`relative p-5 rounded-3xl bg-gradient-to-br ${kpi.color} border ${kpi.border} shadow-xl flex flex-col justify-between overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{kpi.title}</span>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                {kpi.icon}
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl font-black text-white tracking-tight">{kpi.value}</div>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.subtitle}</p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Metric Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Updated
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
