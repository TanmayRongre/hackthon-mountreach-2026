import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  Activity,
  CreditCard,
  Bell,
  UtensilsCrossed,
  FileSpreadsheet,
  Server,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Key,
  QrCode,
  Sliders,
  DollarSign
} from 'lucide-react';

// Modular Admin Sections
import AdminOverviewSection from '../components/admin/AdminOverviewSection';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminHostelManagement from '../components/admin/AdminHostelManagement';
import AdminOperationsSection from '../components/admin/AdminOperationsSection';
import AdminFinanceSection from '../components/admin/AdminFinanceSection';
import AdminNoticesSection from '../components/admin/AdminNoticesSection';
import AdminMessSection from '../components/admin/AdminMessSection';
import AdminAuditLogsSection from '../components/admin/AdminAuditLogsSection';
import AdminSystemHealthSection from '../components/admin/AdminSystemHealthSection';
import AdminReportsSection from '../components/admin/AdminReportsSection';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live Admin Overview Data
  const [overviewStats, setOverviewStats] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, healthRes] = await Promise.allSettled([
        api.getAdminOverview(),
        api.getSystemHealth(),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value.data) {
        setOverviewStats(overviewRes.value.data);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value.data) {
        setHealthData(healthRes.value.data);
      }
      setLastUpdated(new Date());
    } catch (err) {
      showToast(err.message || 'Failed to refresh admin metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Categorized Sidebar Navigation Items
  const navSections = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      group: 'USER GOVERNANCE',
      items: [
        { id: 'users', label: 'Students & Wardens', icon: <Users className="w-4 h-4" />, badge: overviewStats?.kpis?.totalStudents },
      ],
    },
    {
      group: 'INFRASTRUCTURE',
      items: [
        { id: 'hostels', label: 'Hostels & Blocks', icon: <Building2 className="w-4 h-4" />, badge: overviewStats?.kpis?.totalHostels },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { id: 'complaints', label: 'Complaints Escalation', icon: <FileText className="w-4 h-4" />, badge: overviewStats?.kpis?.openComplaints, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'leaves', label: 'Outpasses & Leaves', icon: <Key className="w-4 h-4" />, badge: overviewStats?.kpis?.pendingLeaves, badgeColor: 'bg-sky-500/20 text-sky-300' },
        { id: 'attendance', label: 'Global Attendance', icon: <QrCode className="w-4 h-4" /> },
      ],
    },
    {
      group: 'FINANCE & BILLING',
      items: [
        { id: 'finance', label: 'Fees & Revenue', icon: <CreditCard className="w-4 h-4" /> },
      ],
    },
    {
      group: 'COMMUNICATION & DINING',
      items: [
        { id: 'notices', label: 'Announcements Hub', icon: <Bell className="w-4 h-4" /> },
        { id: 'mess', label: 'Mess & Dining Menu', icon: <UtensilsCrossed className="w-4 h-4" /> },
      ],
    },
    {
      group: 'ANALYTICS & COMPLIANCE',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { id: 'audit-logs', label: 'Security Audit Logs', icon: <Activity className="w-4 h-4" /> },
        { id: 'health', label: 'System Health Telemetry', icon: <Server className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#07101f] text-slate-100 font-sans flex flex-col">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border animate-slide-up ${
            toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-700/60'
              : 'bg-emerald-950/95 text-emerald-200 border-emerald-700/60'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          TOP ADMIN CONTROL NAVBAR
          ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#091527]/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>HostelHub</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-widest border border-indigo-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Central Platform Command Center</p>
            </div>
          </Link>
        </div>

        {/* Middle: Live Technical Telemetry */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>System Online</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <span>DB: {healthData?.database?.latencyMs || 3}ms</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Right: Actions, Admin Badge & Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            title="Refresh All Metrics"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <Link
            to="/student-dashboard"
            className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            Student View →
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white truncate max-w-[120px]">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-amber-400 font-semibold uppercase">Global Admin</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:text-rose-200 hover:bg-rose-900/60 transition-all cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MAIN ADMIN WORKSPACE LAYOUT
          ════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* ── LEFT ADMIN SIDEBAR ── */}
        <aside
          className={`${
            sidebarOpen ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-64 shrink-0 bg-[#0f1b2d]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-6 self-start`}
        >
          <div className="space-y-5">
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 pb-1">
                  {sec.group}
                </div>

                {sec.items.map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`${active ? 'text-white' : 'text-indigo-400 group-hover:scale-110'} transition-transform`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            active ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <div className="text-[10px] text-slate-500">HostelHub Enterprise v2.4</div>
          </div>
        </aside>

        {/* ── RIGHT MAIN CONTENT AREA ── */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <AdminOverviewSection stats={overviewStats} onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'users' && (
            <AdminUserManagement onUserUpdated={loadAdminData} />
          )}

          {activeTab === 'hostels' && (
            <AdminHostelManagement onHostelsUpdated={loadAdminData} />
          )}

          {(activeTab === 'complaints' || activeTab === 'leaves' || activeTab === 'attendance') && (
            <AdminOperationsSection initialSubTab={activeTab} />
          )}

          {activeTab === 'finance' && (
            <AdminFinanceSection onFinanceUpdated={loadAdminData} />
          )}

          {activeTab === 'notices' && (
            <AdminNoticesSection onNoticesUpdated={loadAdminData} />
          )}

          {activeTab === 'mess' && (
            <AdminMessSection />
          )}

          {activeTab === 'reports' && (
            <AdminReportsSection />
          )}

          {activeTab === 'audit-logs' && (
            <AdminAuditLogsSection />
          )}

          {activeTab === 'health' && (
            <AdminSystemHealthSection />
          )}
        </main>
      </div>
    </div>
  );
}
