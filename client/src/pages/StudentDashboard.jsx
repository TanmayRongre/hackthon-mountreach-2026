import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import UnadmittedView from '../components/student/UnadmittedView';
import AdmissionModal from '../components/student/AdmissionModal';
import StudentDashboardView from '../components/student/StudentDashboardView';
import {
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();

  // Student Admission State
  const [studentProfile, setStudentProfile] = useState(null);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Student Admission Profile
  const loadStudentProfile = async () => {
    if (!isAuthenticated) {
      setLoadingStudent(false);
      return;
    }
    setLoadingStudent(true);
    try {
      const res = await api.getMyStudentProfile();
      if (res.success) {
        setIsAdmitted(res.isAdmitted);
        setStudentProfile(res.student);
      } else {
        setIsAdmitted(false);
        setStudentProfile(null);
      }
    } catch {
      setIsAdmitted(false);
      setStudentProfile(null);
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    try {
      await loadStudentProfile();
      setRefreshKey((prev) => prev + 1);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (user?.role === 'warden') {
      window.location.href = '/warden';
      return;
    }
    if (user?.role === 'admin' && window.location.pathname === '/dashboard') {
      window.location.href = '/admin';
      return;
    }
    loadStudentProfile();
  }, [isAuthenticated, user?.role]);

  // Handle Admission Success
  const handleAdmissionSuccess = (newStudent, message) => {
    setStudentProfile(newStudent);
    setIsAdmitted(true);
    showToast(message || 'Hostel admission confirmed successfully!');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#07101f] text-slate-100 font-sans p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border animate-slide-up ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-700/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-700/50'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* ── Top Dashboard Header ── */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Student Hostel Portal</h1>
              <p className="text-xs text-slate-400">Campus residency, room allotments, daily QR attendance, leave applications, and fees.</p>
            </div>
          </div>

          <button
            onClick={handleGlobalRefresh}
            title="Refresh All Portal Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing || loadingStudent ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ── STUDENT HUB VIEW ── */}
        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Student Login Required</h3>
                <p className="text-xs text-slate-400 mt-1">Please login or register to access your student hostel residency portal.</p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Login to Portal →
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Register as Student
                </Link>
              </div>
            </div>
          ) : loadingStudent ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
              <div className="text-xs font-medium text-slate-400">Verifying student admission status...</div>
            </div>
          ) : isAdmitted && studentProfile ? (
            /* ADMITTED VIEW: FULL STUDENT DASHBOARD */
            <StudentDashboardView
              student={studentProfile}
              user={user}
              onRefresh={handleGlobalRefresh}
              refreshKey={refreshKey}
            />
          ) : (
            /* UNADMITTED VIEW: ADMIT NOW BUTTON & FORM */
            <UnadmittedView
              user={user}
              onOpenAdmission={() => setAdmissionModalOpen(true)}
            />
          )}
        </div>

        {/* Admission Modal */}
        <AdmissionModal
          isOpen={admissionModalOpen}
          onClose={() => setAdmissionModalOpen(false)}
          onSuccess={handleAdmissionSuccess}
          initialUser={user}
        />
      </div>
    </div>
  );
}
