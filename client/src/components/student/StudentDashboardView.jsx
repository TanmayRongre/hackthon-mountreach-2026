import React, { useState, useEffect } from 'react';
import {
  Building2,
  BedDouble,
  ShieldCheck,
  CreditCard,
  UtensilsCrossed,
  Key,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  RefreshCw,
  Search,
  ChevronRight,
  Bell,
  Calendar,
  Phone,
  User,
  MapPin,
  Sparkles,
  Download,
  Check,
  QrCode,
  Users,
  Eye,
  Camera,
  Activity,
  ArrowUpRight,
  Filter,
  Menu,
  X,
  LayoutDashboard,
  Home,
  Sun,
  Moon,
  Coffee,
  Flame,
  Table,
  LayoutGrid
} from 'lucide-react';
import api from '../../services/api';
import FeeReceiptModal from './FeeReceiptModal';
import ScanAttendanceModal from './ScanAttendanceModal';
import RequestVisitorModal from './RequestVisitorModal';

export default function StudentDashboardView({ student, user, onRefresh, refreshKey }) {
  // Navigation Tabs: overview | attendance | complaints | leaves | visitors | fees | mess | notices
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingData, setLoadingData] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Module Data States
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [fees, setFees] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  const [notices, setNotices] = useState([]);

  // Modals
  const [complaintModal, setComplaintModal] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: 'Electrical',
    priority: 'medium',
  });

  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'outpass',
    reason: '',
    fromDate: '',
    toDate: '',
    destination: '',
    emergencyContact: '',
  });

  const [scanAttendanceModal, setScanAttendanceModal] = useState(false);
  const [visitorModal, setVisitorModal] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null); // fee object
  const [payModal, setPayModal] = useState(null);
  const [paying, setPaying] = useState(false);

  // Mess Menu Day States
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const [selectedMessDay, setSelectedMessDay] = useState(todayDayName);
  const [messViewMode, setMessViewMode] = useState('daily'); // 'daily' | 'table'

  // Filters
  const [complaintFilter, setComplaintFilter] = useState('all');

  // Toast feedback
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Sub-module Data
  const loadModuleData = async () => {
    setLoadingData(true);
    try {
      const [compRes, leaveRes, feeRes, visRes, attRes, messRes, notRes] = await Promise.allSettled([
        api.getComplaints(`student=${user?._id}`),
        api.getLeaves(`student=${user?._id}`),
        api.getFees(`student=${user?._id}`),
        api.getVisitors(`student=${user?._id}`),
        api.getAttendance(`student=${user?._id}`),
        api.getMess(),
        api.getNotices(),
      ]);

      if (compRes.status === 'fulfilled' && compRes.value.data) {
        setComplaints(compRes.value.data);
      }
      if (leaveRes.status === 'fulfilled' && leaveRes.value.data) {
        setLeaves(leaveRes.value.data);
      }
      if (feeRes.status === 'fulfilled' && feeRes.value.data) {
        setFees(feeRes.value.data);
      }
      if (visRes.status === 'fulfilled' && visRes.value.data) {
        setVisitors(visRes.value.data);
      }
      if (attRes.status === 'fulfilled' && attRes.value.data) {
        setAttendanceRecords(attRes.value.data);
      }
      if (messRes.status === 'fulfilled' && messRes.value.data) {
        setMessMenu(messRes.value.data);
      }
      if (notRes.status === 'fulfilled' && notRes.value.data) {
        setNotices(notRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching student module data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadModuleData();
  }, [user?._id, refreshKey]);

  // Handle File Complaint Submit
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createComplaint({
        ...complaintForm,
        student: user?._id,
        hostel: student?.hostel?._id || student?.hostel,
        room: student?.room?._id || student?.room,
      });
      showToast('Grievance registered and assigned to Warden successfully!');
      setComplaintModal(false);
      setComplaintForm({ title: '', description: '', category: 'Electrical', priority: 'medium' });
      loadModuleData();
    } catch (err) {
      showToast(err.message || 'Failed to submit complaint', 'error');
    }
  };

  // Handle Leave Submit
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createLeave({
        ...leaveForm,
        student: user?._id,
        emergencyContact: leaveForm.emergencyContact || student?.parentPhone || student?.phone,
      });
      showToast('Digital Leave Application submitted for Warden approval!');
      setLeaveModal(false);
      setLeaveForm({
        leaveType: 'outpass',
        reason: '',
        fromDate: '',
        toDate: '',
        destination: '',
        emergencyContact: '',
      });
      loadModuleData();
    } catch (err) {
      showToast(err.message || 'Failed to apply for leave', 'error');
    }
  };

  // Handle Fee Payment
  const handleProcessPayment = async (feeId) => {
    setPaying(true);
    try {
      const res = await api.payFee(feeId, {
        paymentMode: 'Online (UPI/NetBanking)',
      });
      showToast('Payment successful! Opening receipt...');
      setPayModal(null);
      setViewingReceipt(res.data);
      loadModuleData();
    } catch (err) {
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setPaying(false);
    }
  };

  // Today attendance status
  const todayStr = new Date().toDateString();
  const isPresentToday = attendanceRecords.some((a) => new Date(a.date).toDateString() === todayStr && a.status === 'present');

  // Metrics
  const pendingFees = fees.filter((f) => f.status === 'pending');
  const totalDues = pendingFees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const activeLeaves = leaves.filter((l) => l.status === 'approved' || l.status === 'pending');
  const openComplaints = complaints.filter((c) => c.status === 'pending' || c.status === 'in_progress');

  const filteredComplaints = complaints.filter((c) => {
    if (complaintFilter === 'all') return true;
    return c.status === complaintFilter;
  });

  // Simplified Navigation Items with Icons & Badges
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'attendance',
      label: 'Scan Attendance',
      icon: <QrCode className="w-4 h-4" />,
      badge: isPresentToday ? '✓ Present' : 'Pending',
      badgeColor: isPresentToday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'complaints',
      label: 'Raise Complaint',
      icon: <FileText className="w-4 h-4" />,
      badge: openComplaints.length > 0 ? `${openComplaints.length}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'leaves',
      label: 'Leave Application',
      icon: <Key className="w-4 h-4" />,
      badge: activeLeaves.length > 0 ? `${activeLeaves.length}` : null,
      badgeColor: 'bg-sky-500/20 text-sky-300',
    },
    {
      id: 'visitors',
      label: 'Visitor Request',
      icon: <Users className="w-4 h-4" />,
      badge: visitors.length > 0 ? `${visitors.length}` : null,
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      id: 'fees',
      label: 'Hostel Fees',
      icon: <CreditCard className="w-4 h-4" />,
      badge: totalDues > 0 ? `₹${totalDues > 1000 ? Math.round(totalDues/1000) + 'k' : totalDues}` : '✓ Paid',
      badgeColor: totalDues > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300',
    },
    { id: 'mess', label: 'Mess Menu', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" />, badge: notices.length > 0 ? `${notices.length}` : null },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in relative">
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

      {/* ── Mobile Sidebar Toggle Bar ── */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              {navItems.find((n) => n.id === activeTab)?.label}
            </div>
            <div className="text-[10px] text-slate-400">Roll: {student?.enrollmentNumber}</div>
          </div>
        </div>
        <button
          onClick={() => setScanAttendanceModal(true)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════
          LEFT SIDEBAR COMPONENT
          ════════════════════════════════════════════════ */}
      <aside
        className={`${
          sidebarOpen ? 'flex' : 'hidden'
        } lg:flex flex-col w-full lg:w-72 shrink-0 bg-[#0f1b2d]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5 self-start`}
      >
        {/* Student Resident Profile Mini-Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/25 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f1b2d]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-[11px] font-mono text-indigo-300 uppercase">{student?.enrollmentNumber || 'CS2026-088'}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Allotment:</span>
              <strong className="text-white">Room #{student?.room?.roomNumber || '101'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Bed:</span>
              <strong className="text-indigo-300">Bed {student?.bed?.bedNumber || 'B-1'} ({student?.room?.type || 'AC'})</strong>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Complex:</span>
              <span className="text-slate-300 truncate max-w-[120px]">{student?.hostel?.name || 'Block A'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Link List */}
        <div className="space-y-1.5 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Student Resident Modules
          </div>

          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${active ? 'text-white' : 'text-indigo-400 group-hover:scale-110'} transition-transform`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
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

        {/* Quick Launch Buttons in Sidebar Footer */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setScanAttendanceModal(true)}
            className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Attendance</span>
          </button>

          <button
            onClick={() => setComplaintModal(true)}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Raise Complaint</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════
          RIGHT MAIN CONTENT AREA
          ════════════════════════════════════════════════ */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Top Header Card within Content */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#121f36] via-[#0f1b2d] to-[#15233c] border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {navItems.find((n) => n.id === activeTab)?.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Resident
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Welcome back, {user?.name}!
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Portal Sync</span>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Key Stat Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Attendance Tile */}
              <div
                onClick={() => setActiveTab('attendance')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Today's Attendance</span>
                  <QrCode className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-white mt-2">
                  {isPresentToday ? 'Marked Present' : 'Pending Scan'}
                </div>
                <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${isPresentToday ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPresentToday ? '✓ Verified via QR' : '📸 Click to Scan QR →'}
                </div>
              </div>

              {/* Room Allotment */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="text-xs text-slate-400 font-medium">Allotment Unit</div>
                <div className="text-xl font-bold text-white mt-2">
                  Room #{student?.room?.roomNumber || '101'}
                  <span className="text-xs text-indigo-400 font-normal ml-1.5">Bed {student?.bed?.bedNumber || 'B-1'}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{student?.hostel?.name || 'Block A Complex'}</div>
              </div>

              {/* Fee Dues */}
              <div
                onClick={() => setActiveTab('fees')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Semester Dues</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white mt-2">
                  ₹{totalDues.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-indigo-400 font-medium mt-1">View & Pay Invoices →</div>
              </div>

              {/* Outpass & Leaves */}
              <div
                onClick={() => setActiveTab('leaves')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Active Outpasses</span>
                  <Key className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xl font-bold text-white mt-2">
                  {activeLeaves.length} Active
                </div>
                <div className="text-[11px] text-sky-400 font-medium mt-1">Digital Gatepasses →</div>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setScanAttendanceModal(true)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Scan Attendance</h4>
                <p className="text-[11px] text-slate-400 mt-1">Mark daily floor presence</p>
              </button>

              <button
                onClick={() => setComplaintModal(true)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Raise Complaint</h4>
                <p className="text-[11px] text-slate-400 mt-1">Report room & maintenance issues</p>
              </button>

              <button
                onClick={() => setLeaveModal(true)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Key className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Leave Application</h4>
                <p className="text-[11px] text-slate-400 mt-1">Apply for digital outpass</p>
              </button>

              <button
                onClick={() => setVisitorModal(true)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Visitor Request</h4>
                <p className="text-[11px] text-slate-400 mt-1">Entry pass for guests & parents</p>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Hostel Fees</h4>
                <p className="text-[11px] text-slate-400 mt-1">View dues & payment receipts</p>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: SCAN ATTENDANCE ── */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-400" />
                  Smart Hostel Attendance System
                </h2>
                <p className="text-xs text-slate-400">Mark your daily resident presence using the smart QR scanner.</p>
              </div>
              <button
                onClick={() => setScanAttendanceModal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Launch QR Scanner Terminal</span>
              </button>
            </div>

            {/* Attendance History Log */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Attendance Verification Log</h3>
              <div className="space-y-2.5">
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((att) => (
                    <div key={att._id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{new Date(att.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                          <div className="text-[11px] text-slate-400">Time: {new Date(att.date).toLocaleTimeString()} · {att.remarks || 'QR Verified'}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase text-[10px]">
                        {att.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No attendance entries yet. Click "Launch QR Scanner Terminal" to mark presence today.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: COMPLAINTS & TRACKING ── */}
        {activeTab === 'complaints' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Grievance & Maintenance Tracker
                </h2>
                <p className="text-xs text-slate-400">Lodge complaints and follow live resolution progress step-by-step.</p>
              </div>
              <button
                onClick={() => setComplaintModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Send New Complain</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1"><Filter className="w-3 h-3" /> Filter:</span>
              {['all', 'pending', 'in_progress', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setComplaintFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                    complaintFilter === st
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Complaints List with Step-by-Step Tracker */}
            <div className="space-y-5">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => {
                  let stage = 1;
                  if (c.status === 'in_progress') stage = 3;
                  if (c.status === 'resolved') stage = 4;

                  return (
                    <div key={c._id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                              {c.category}
                            </span>
                            <h3 className="text-base font-bold text-white">{c.title}</h3>
                          </div>
                          <p className="text-xs text-slate-300/90 leading-relaxed">{c.description}</p>
                        </div>

                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                          c.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          c.status === 'in_progress' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                          'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          Status: {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Visual 4-Step Resolution Tracker */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Resolution Progress</div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className={`p-2.5 rounded-xl border ${stage >= 1 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <div className="font-bold text-[11px]">1. Submitted</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</div>
                          </div>

                          <div className={`p-2.5 rounded-xl border ${stage >= 2 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <div className="font-bold text-[11px]">2. Assigned</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Warden Office</div>
                          </div>

                          <div className={`p-2.5 rounded-xl border ${stage >= 3 ? 'bg-sky-950/40 border-sky-500/40 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <div className="font-bold text-[11px]">3. In Progress</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Technician Onsite</div>
                          </div>

                          <div className={`p-2.5 rounded-xl border ${stage >= 4 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <div className="font-bold text-[11px]">4. Resolved</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Verified Done</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No complaints matching "{complaintFilter}". Click "Send New Complain" to lodge an issue.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: LEAVE & OUTPASS ── */}
        {activeTab === 'leaves' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-sky-400" />
                  Submit & Track Leave Applications
                </h2>
                <p className="text-xs text-slate-400">Request digital outpasses for weekend visits, emergencies, or vacations.</p>
              </div>
              <button
                onClick={() => setLeaveModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Leave Application</span>
              </button>
            </div>

            <div className="space-y-4">
              {leaves.length > 0 ? (
                leaves.map((l) => (
                  <div key={l._id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300">
                          {l.leaveType}
                        </span>
                        <h4 className="text-sm font-bold text-white">{l.destination}</h4>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        l.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        l.status === 'rejected' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {l.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">Purpose: {l.reason}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Departure:</span>
                        <strong className="text-white">{new Date(l.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Expected Return:</span>
                        <strong className="text-white">{new Date(l.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Emergency Contact:</span>
                        <strong className="text-slate-300">{l.emergencyContact || student?.parentPhone || 'Parent'}</strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No leave records. Click "Submit Leave Application" to apply for an outpass.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 5: VISITOR PASSES ── */}
        {activeTab === 'visitors' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Guest & Visitor Gatepasses
                </h2>
                <p className="text-xs text-slate-400">Request permission for parents and visitors to enter the hostel campus.</p>
              </div>
              <button
                onClick={() => setVisitorModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Request Visitor</span>
              </button>
            </div>

            <div className="space-y-4">
              {visitors.length > 0 ? (
                visitors.map((v) => (
                  <div key={v._id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                          {v.passNumber}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{v.visitorName} ({v.relationship})</h4>
                          <div className="text-[11px] text-slate-400">Phone: {v.phone}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                        v.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : v.status === 'rejected'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {v.status === 'approved' ? '✓ Pass Approved' : v.status === 'rejected' ? '✕ Request Rejected' : '⏳ Pending Warden Approval'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">Purpose: {v.purpose}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800">
                      <span>Visit Date: <strong className="text-white">{new Date(v.visitDate).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No visitor passes requested. Click "Request Visitor" to invite parents or guests.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 6: FEES & VIEW RECEIPTS ── */}
        {activeTab === 'fees' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Fee Dues & Official Receipts
                </h2>
                <p className="text-xs text-slate-400">View detailed invoices, pay online, and open verified fee receipts.</p>
              </div>
            </div>

            <div className="space-y-4">
              {fees.length > 0 ? (
                fees.map((f) => (
                  <div key={f._id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-white">{f.title}</h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          f.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Due Date: {new Date(f.dueDate).toLocaleDateString()} · Receipt ID: {f.receiptNumber || 'Generated upon payment'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-black text-white font-mono">₹{f.amount?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-400">{f.feeType}</div>
                      </div>

                      {f.status === 'paid' ? (
                        <button
                          onClick={() => setViewingReceipt(f)}
                          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setPayModal(f)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          Pay Online →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No fee records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 7: MESS TIMETABLE (7-DAY WEEKLY SCHEDULE) ── */}
        {activeTab === 'mess' && (() => {
          const fallbackWeeklyMenu = [
            { dayOfWeek: 'Monday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Poha with Chutney', 'Boiled Eggs / Sprouts', 'Tea / Coffee / Milk', 'Banana'], specialDiet: 'Gluten-free oats available' },
            { dayOfWeek: 'Monday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Dal Tadka', 'Jeera Rice', 'Paneer Butter Masala', 'Chapati', 'Green Salad', 'Gulab Jamun'], specialDiet: 'Jain Dal available' },
            { dayOfWeek: 'Monday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Veg Sandwich', 'Masala Chai', 'Biscuits'] },
            { dayOfWeek: 'Monday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Mix Veg Curry', 'Roti', 'Steamed Rice', 'Moong Dal', 'Raita'] },

            { dayOfWeek: 'Tuesday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Idli & Sambar', 'Coconut Chutney', 'Tea / Coffee / Milk', 'Apple'] },
            { dayOfWeek: 'Tuesday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Rajma Masala', 'Basmati Rice', 'Aloo Gobi', 'Phulka', 'Curd', 'Papad'] },
            { dayOfWeek: 'Tuesday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Samosa with Imli Chutney', 'Adrak Chai'] },
            { dayOfWeek: 'Tuesday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Palak Paneer', 'Chapati', 'Fried Rice', 'Dal Makhani', 'Kheer'] },

            { dayOfWeek: 'Wednesday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Aloo Paratha with Curd & Pickle', 'Tea / Coffee / Milk'] },
            { dayOfWeek: 'Wednesday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Chole Bhature', 'Veg Biryani', 'Boondi Raita', 'Onion Salad'] },
            { dayOfWeek: 'Wednesday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Bhel Puri', 'Cold Coffee / Lemon Tea'] },
            { dayOfWeek: 'Wednesday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Egg Curry / Kadai Paneer', 'Roti', 'Jeera Rice', 'Yellow Dal'] },

            { dayOfWeek: 'Thursday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Upma with Sambar & Coconut Chutney', 'Boiled Eggs', 'Tea / Coffee'] },
            { dayOfWeek: 'Thursday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Kadhi Pakora', 'Steamed Rice', 'Bhindi Masala', 'Chapati', 'Salad'] },
            { dayOfWeek: 'Thursday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Pav Bhaji (2 pcs)', 'Filter Coffee'] },
            { dayOfWeek: 'Thursday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Dum Aloo', 'Roti', 'Veg Pulao', 'Dal Fry', 'Custard'] },

            { dayOfWeek: 'Friday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Uttapam with Sambar', 'Tomato Chutney', 'Tea / Milk'] },
            { dayOfWeek: 'Friday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Paneer Tikka Masala', 'Butter Naan / Roti', 'Peas Pulao', 'Dal Tadka'] },
            { dayOfWeek: 'Friday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Dhokla with Green Chutney', 'Chai'] },
            { dayOfWeek: 'Friday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Chicken Curry / Shahi Paneer', 'Rumali Roti', 'Biryani Rice', 'Ice Cream'] },

            { dayOfWeek: 'Saturday', mealType: 'Breakfast', timing: '7:30 AM - 9:30 AM', menuItems: ['Puri Bhaji (Aloo Curry)', 'Halwa', 'Tea / Coffee / Milk'] },
            { dayOfWeek: 'Saturday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Sambhar Rice', 'Avial / Mix Veg', 'Curd Rice', 'Papad & Pickle'] },
            { dayOfWeek: 'Saturday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Pasta / Macaroni', 'Hot Chocolate / Tea'] },
            { dayOfWeek: 'Saturday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Malai Kofta', 'Chapati', 'Fried Rice', 'Dal Makhani', 'Rasgulla'] },

            { dayOfWeek: 'Sunday', mealType: 'Breakfast', timing: '8:00 AM - 10:00 AM', menuItems: ['Masala Dosa', 'Sambar & Chutney Trio', 'Filter Coffee / Milk'] },
            { dayOfWeek: 'Sunday', mealType: 'Lunch', timing: '12:30 PM - 2:30 PM', menuItems: ['Special Sunday Feast (Paneer Lababdar / Chicken Biryani)', 'Butter Roti', 'Raita', 'Sweet Lassi'] },
            { dayOfWeek: 'Sunday', mealType: 'Snacks', timing: '5:00 PM - 6:00 PM', menuItems: ['Kachori with Sweet Chutney', 'Masala Tea'] },
            { dayOfWeek: 'Sunday', mealType: 'Dinner', timing: '7:30 PM - 9:30 PM', menuItems: ['Light Khichdi / Veg Pulao', 'Kadhi', 'Papad', 'Fruit Salad'] },
          ];

          const allWeeklyData = messMenu.length > 0 ? messMenu : fallbackWeeklyMenu;
          const currentDayMeals = allWeeklyData.filter((m) => m.dayOfWeek === selectedMessDay);

          const getMealMeta = (type) => {
            switch (type) {
              case 'Breakfast':
                return {
                  icon: <Sun className="w-5 h-5 text-amber-400" />,
                  bg: 'from-amber-950/40 via-slate-900 to-slate-950',
                  badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                  tag: 'Morning Nutrition',
                };
              case 'Lunch':
                return {
                  icon: <Flame className="w-5 h-5 text-orange-400" />,
                  bg: 'from-orange-950/40 via-slate-900 to-slate-950',
                  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
                  tag: 'Hearty Full Meal',
                };
              case 'Snacks':
                return {
                  icon: <Coffee className="w-5 h-5 text-emerald-400" />,
                  bg: 'from-emerald-950/40 via-slate-900 to-slate-950',
                  badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                  tag: 'Evening Refreshment',
                };
              case 'Dinner':
              default:
                return {
                  icon: <Moon className="w-5 h-5 text-indigo-400" />,
                  bg: 'from-indigo-950/40 via-slate-900 to-slate-950',
                  badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                  tag: 'Night Dining',
                };
            }
          };

          return (
            <div className="space-y-6 animate-fade-in">
              {/* Header with View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                    Central Mess Weekly Dining Schedule
                  </h2>
                  <p className="text-xs text-slate-400">Nutritious meal schedule prepared daily in certified clean kitchens.</p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMessViewMode('daily')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      messViewMode === 'daily'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Daily Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessViewMode('table')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      messViewMode === 'table'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>7-Day Table</span>
                  </button>
                </div>
              </div>

              {/* ── 7-DAY WEEKLY SELECTOR TABS ── */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {daysOfWeek.map((day) => {
                  const isToday = day === todayDayName;
                  const isSelected = day === selectedMessDay;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedMessDay(day);
                        if (messViewMode === 'table') setMessViewMode('daily');
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <span>{day}</span>
                      {isToday && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        }`}>
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── VIEW 1: DAILY 4-MEALS CARDS ── */}
              {messViewMode === 'daily' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="font-semibold text-slate-300">
                      Showing Menu for: <strong className="text-indigo-400">{selectedMessDay}</strong>
                      {selectedMessDay === todayDayName && ' (Today\'s Active Menu)'}
                    </span>
                    <span>4 Fresh Meal Services</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => {
                      const meal = currentDayMeals.find((m) => m.mealType === type) || {
                        dayOfWeek: selectedMessDay,
                        mealType: type,
                        timing: type === 'Breakfast' ? '7:30 AM - 9:30 AM' : type === 'Lunch' ? '12:30 PM - 2:30 PM' : type === 'Snacks' ? '5:00 PM - 6:00 PM' : '7:30 PM - 9:30 PM',
                        menuItems: ['Chef Special Nutritious Platter', 'Accompaniments', 'Beverage'],
                      };
                      const meta = getMealMeta(type);

                      return (
                        <div
                          key={type}
                          className={`p-5 rounded-3xl bg-gradient-to-br ${meta.bg} border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                                  {meta.icon}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-white">{meal.mealType}</h4>
                                  <span className="text-[10px] text-slate-400">{meta.tag}</span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badge}`}>
                                {meal.timing || 'Standard Timings'}
                              </span>
                            </div>

                            <div className="pt-2 space-y-2">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Menu Items:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {meal.menuItems && meal.menuItems.length > 0 ? (
                                  meal.menuItems.map((item, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 font-medium flex items-center gap-1.5"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                      {item}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-500 italic">Chef's daily special assortment</span>
                                )}
                              </div>
                            </div>

                            {meal.specialDiet && (
                              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{meal.specialDiet}</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Central Dining Hall</span>
                            <span className="text-emerald-400 font-semibold">✓ Pure Veg / Balanced</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── VIEW 2: COMPLETE 7-DAY WEEKLY TABLE MATRIX ── */}
              {messViewMode === 'table' && (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0f1b2d]/80 shadow-2xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-4 px-4">Day</th>
                        <th className="py-4 px-4">🌅 Breakfast (7:30-9:30 AM)</th>
                        <th className="py-4 px-4">☀️ Lunch (12:30-2:30 PM)</th>
                        <th className="py-4 px-4">☕ Evening Snacks (5-6 PM)</th>
                        <th className="py-4 px-4">🌙 Dinner (7:30-9:30 PM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {daysOfWeek.map((day) => {
                        const dayMeals = allWeeklyData.filter((m) => m.dayOfWeek === day);
                        const isToday = day === todayDayName;

                        const bFast = dayMeals.find((m) => m.mealType === 'Breakfast');
                        const lunch = dayMeals.find((m) => m.mealType === 'Lunch');
                        const snacks = dayMeals.find((m) => m.mealType === 'Snacks');
                        const dinner = dayMeals.find((m) => m.mealType === 'Dinner');

                        return (
                          <tr
                            key={day}
                            className={`transition-colors ${
                              isToday ? 'bg-indigo-950/20' : 'hover:bg-slate-900/40'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span>{day}</span>
                                {isToday && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase">
                                    Today
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              {bFast?.menuItems?.join(', ') || 'Idli, Poha, Tea/Coffee'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              {lunch?.menuItems?.join(', ') || 'Dal, Rice, Roti, Sabzi, Curd'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              {snacks?.menuItems?.join(', ') || 'Snacks & Masala Chai'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              {dinner?.menuItems?.join(', ') || 'Paneer/Curry, Roti, Rice, Sweet'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mess Rules & Meal Timing Guidance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Meal Timing Discipline
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Breakfast closes strictly at 9:30 AM. Dinner is served until 9:30 PM for all hostel residents.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Special Diets & Medical Needs
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Jain, vegan, and convalescent diet trays are prepared on prior request through the warden portal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    FSSAI Certified Kitchen
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Water quality tests and kitchen sanitization are inspected weekly by campus health officers.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── TAB 8: NOTICES ── */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Campus Circulars & Hostel Notices</h2>
              <p className="text-xs text-slate-400">Official circulars from Hostel Wardens and Campus Administration.</p>
            </div>

            <div className="space-y-4">
              {notices.map((n) => (
                <div key={n._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{n.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      n.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {n.category || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Posted on {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: FILE COMPLAINT ── */}
      {complaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f1b2d] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Send Grievance / Maintenance Complain
              </h3>
              <button onClick={() => setComplaintModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleComplaintSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bathroom tap leakage in Room 101"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Mess & Food">Mess & Food</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the exact issue details..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setComplaintModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Submit Complain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: APPLY LEAVE / OUTPASS ── */}
      {leaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f1b2d] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-400" />
                Submit Leave / Outpass Application
              </h3>
              <button onClick={() => setLeaveModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="outpass">Day Outpass</option>
                    <option value="weekend">Weekend Home Stay</option>
                    <option value="vacation">Semester Vacation</option>
                    <option value="emergency">Emergency Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Destination Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home (Mumbai)"
                    value={leaveForm.destination}
                    onChange={(e) => setLeaveForm({ ...leaveForm, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.fromDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expected Return Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.toDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason for Leave *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State purpose of departure..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLeaveModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30 cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PAY ONLINE SIMULATOR ── */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0f1b2d] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Pay Hostel Fee Online
              </h3>
              <button onClick={() => setPayModal(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <div className="text-xs text-slate-400">{payModal.title}</div>
              <div className="text-2xl font-black text-white font-mono">₹{payModal.amount?.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Verified Payment Gateway Simulator</div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between text-slate-200">
                <span>Payment Mode</span>
                <strong className="text-emerald-400">Instant UPI / NetBanking</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between text-slate-200">
                <span>Student</span>
                <span>{user?.name}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPayModal(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paying}
                onClick={() => handleProcessPayment(payModal._id)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              >
                {paying ? 'Processing...' : `Confirm & Pay ₹${payModal.amount?.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW OFFICIAL FEE RECEIPT ── */}
      <FeeReceiptModal
        isOpen={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        fee={viewingReceipt}
        student={student}
        user={user}
      />

      {/* ── MODAL: SCAN ATTENDANCE QR ── */}
      <ScanAttendanceModal
        isOpen={scanAttendanceModal}
        onClose={() => setScanAttendanceModal(false)}
        student={student}
        user={user}
        onAttendanceMarked={(newRecord) => {
          showToast('Attendance verified & marked Present!');
          loadModuleData();
        }}
      />

      {/* ── MODAL: REQUEST VISITOR GATEPASS ── */}
      <RequestVisitorModal
        isOpen={visitorModal}
        onClose={() => setVisitorModal(false)}
        student={student}
        user={user}
        onVisitorCreated={(newVis) => {
          showToast('Visitor request submitted to Warden for gate clearance approval!');
          loadModuleData();
        }}
      />
    </div>
  );
}
