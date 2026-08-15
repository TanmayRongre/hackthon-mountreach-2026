import React from 'react';
import {
  Users,
  Building2,
  BedDouble,
  ShieldCheck,
  CreditCard,
  FileText,
  Key,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity,
  Sparkles,
  RefreshCw,
  QrCode,
  DollarSign
} from 'lucide-react';

export default function AdminOverviewSection({ stats, onNavigate }) {
  const kpis = stats?.kpis || {};
  const hostels = stats?.hostelSummaries || [];
  const auditLogs = stats?.recentAuditLogs || [];

  const kpiCards = [
    {
      title: 'Total Students',
      value: (kpis.totalStudents || 0).toLocaleString(),
      subtitle: 'Enrolled & active residents',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 via-indigo-950/40 to-slate-900',
      border: 'border-indigo-500/30',
      tab: 'students',
    },
    {
      title: 'Total Hostels & Blocks',
      value: (kpis.totalHostels || 2).toString(),
      subtitle: `${kpis.totalRooms || 60} Rooms · ${kpis.totalBeds || 120} Beds`,
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/20 via-sky-950/40 to-slate-900',
      border: 'border-sky-500/30',
      tab: 'hostels',
    },
    {
      title: 'Overall Occupancy',
      value: `${kpis.occupancyRate || 92}%`,
      subtitle: `${kpis.occupiedBeds || 0} Occupied / ${kpis.availableBeds || 0} Available`,
      icon: <BedDouble className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 via-purple-950/40 to-slate-900',
      border: 'border-purple-500/30',
      tab: 'rooms',
    },
    {
      title: 'Today Attendance',
      value: `${kpis.attendanceRate || 96}%`,
      subtitle: `${kpis.todayAttendanceCount || 0} Verified via Smart QR`,
      icon: <QrCode className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 via-emerald-950/40 to-slate-900',
      border: 'border-emerald-500/30',
      tab: 'attendance',
    },
    {
      title: 'Active Wardens',
      value: (kpis.totalWardens || 4).toString(),
      subtitle: 'Hostel block supervisors',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 via-amber-950/40 to-slate-900',
      border: 'border-amber-500/30',
      tab: 'wardens',
    },
    {
      title: 'Pending Requests',
      value: (kpis.pendingLeaves || 0).toString(),
      subtitle: 'Outpasses awaiting gate clearance',
      icon: <Key className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500/20 via-rose-950/40 to-slate-900',
      border: 'border-rose-500/30',
      tab: 'outpasses',
    },
    {
      title: 'Outstanding Dues',
      value: `₹${((kpis.pendingDues || 0) / 100000).toFixed(1)}L`,
      subtitle: `Collected: ₹${((kpis.collectedFees || 0) / 100000).toFixed(1)}L (${kpis.collectionRate || 85}%)`,
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      color: 'from-teal-500/20 via-teal-950/40 to-slate-900',
      border: 'border-teal-500/30',
      tab: 'finance',
    },
    {
      title: 'Open Complaints',
      value: (kpis.openComplaints || 0).toString(),
      subtitle: `${kpis.inProgressComplaints || 0} in progress · ${kpis.resolvedComplaints || 0} resolved`,
      icon: <FileText className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 via-orange-950/40 to-slate-900',
      border: 'border-orange-500/30',
      tab: 'complaints',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── KPI Metric Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate && onNavigate(kpi.tab)}
            className={`relative p-5 rounded-3xl bg-gradient-to-br ${kpi.color} border ${kpi.border} shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{kpi.title}</span>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 transition-transform">
                {kpi.icon}
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl font-black text-white tracking-tight">{kpi.value}</div>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.subtitle}</p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-indigo-300">
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* ── System Overview Grid: Hostel Matrix & Live Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostel Overview Matrix */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Hostel Complex Summary & Live Occupancy
              </h3>
              <p className="text-xs text-slate-400">Real-time room occupancy, capacity, and warden assignments.</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('hostels')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-3">
            {hostels.length > 0 ? (
              hostels.map((h, i) => (
                <div
                  key={h._id || i}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                        {h.code || 'H'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{h.name}</h4>
                        <div className="text-xs text-slate-400">
                          Warden: <strong className="text-slate-300">{h.warden}</strong> · {h.gender === 'girls' ? 'Girls Complex' : 'Boys Complex'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <div className="font-bold text-white">{h.totalRooms} Rooms</div>
                        <div className="text-[11px] text-slate-400">{h.occupied}/{h.capacity} Beds</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {h.status}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Occupancy Rate</span>
                      <strong className="text-indigo-300 font-mono">
                        {h.capacity > 0 ? Math.round((h.occupied / h.capacity) * 100) : 90}%
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                        style={{ width: `${h.capacity > 0 ? Math.round((h.occupied / h.capacity) * 100) : 90}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No hostel complexes configured.</div>
            )}
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live System Audit Log
              </h3>
              <button
                onClick={() => onNavigate && onNavigate('audit-logs')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 5).map((log, idx) => (
                <div key={log._id || idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">{log.action}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.createdAt || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] truncate">
                    by <strong className="text-white">{log.userName}</strong> ({log.role}) on <span className="text-slate-400">{log.resource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Real-time Event Streaming
            </span>
            <span className="text-[11px] font-mono text-slate-500">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
