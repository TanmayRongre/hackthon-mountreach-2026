import React, { useState, useEffect } from 'react';
import {
  Activity,
  QrCode,
  FileText,
  Key,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Check,
  X,
  Send,
  Building2,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

export default function AdminOperationsSection({ initialSubTab = 'complaints' }) {
  const [subTab, setSubTab] = useState(initialSubTab); // complaints | leaves | visitors | attendance
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status updating state
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, leaveRes, visRes, attRes] = await Promise.allSettled([
        api.getComplaints(),
        api.getLeaves(),
        api.getVisitors(),
        api.getAttendance(),
      ]);

      if (compRes.status === 'fulfilled' && compRes.value.data) setComplaints(compRes.value.data);
      if (leaveRes.status === 'fulfilled' && leaveRes.value.data) setLeaves(leaveRes.value.data);
      if (visRes.status === 'fulfilled' && visRes.value.data) setVisitors(visRes.value.data);
      if (attRes.status === 'fulfilled' && attRes.value.data) setAttendance(attRes.value.data);
    } catch (err) {
      showToast(err.message || 'Failed to load operations data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateComplaintStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.updateComplaint(id, { status });
      showToast(`Complaint status marked as ${status}`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update complaint', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.updateLeave(id, { status });
      showToast(`Outpass request marked as ${status}`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update outpass', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border animate-slide-up ${
          toast.type === 'error' ? 'bg-rose-950/95 text-rose-200 border-rose-700/60' : 'bg-emerald-950/95 text-emerald-200 border-emerald-700/60'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Central Campus Operations
          </h2>
          <p className="text-xs text-slate-400">Manage daily hostel attendance, gatepass approvals, complaints escalation, and visitor permits.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'complaints', label: `Complaints (${complaints.filter(c => c.status !== 'resolved').length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'leaves', label: `Outpasses (${leaves.filter(l => l.status === 'pending').length})`, icon: <Key className="w-4 h-4" /> },
            { id: 'visitors', label: `Visitors (${visitors.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'attendance', label: `Attendance (${attendance.length})`, icon: <QrCode className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                subTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. COMPLAINTS & GRIEVANCE ESCALATION ── */}
      {subTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <div key={c._id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                      {c.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      c.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      c.status === 'in_progress' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Filed by: <strong className="text-white">{c.student?.name || 'Resident'}</strong> ({c.student?.email}) · Date: {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status !== 'in_progress' && c.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateComplaintStatus(c._id, 'in_progress')}
                        disabled={actionLoading}
                        className="px-3 py-1 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-[11px] font-bold"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {c.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateComplaintStatus(c._id, 'resolved')}
                        disabled={actionLoading}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
              No complaint tickets lodged.
            </div>
          )}
        </div>
      )}

      {/* ── 2. OUTPASSES & LEAVES APPROVAL ── */}
      {subTab === 'leaves' && (
        <div className="space-y-4">
          {leaves.length > 0 ? (
            leaves.map((l) => (
              <div key={l._id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300">
                      {l.leaveType}
                    </span>
                    <h4 className="text-sm font-bold text-white">{l.destination}</h4>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    l.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                    l.status === 'rejected' ? 'bg-rose-500/15 text-rose-400' :
                    'bg-amber-500/15 text-amber-400'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">Purpose: {l.reason}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Student: <strong className="text-white">{l.student?.name || 'Resident'}</strong> · Departure: {new Date(l.fromDate).toLocaleString()}
                  </div>

                  {l.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateLeaveStatus(l._id, 'approved')}
                        disabled={actionLoading}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                      >
                        ✓ Approve Pass
                      </button>
                      <button
                        onClick={() => handleUpdateLeaveStatus(l._id, 'rejected')}
                        disabled={actionLoading}
                        className="px-3 py-1 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
              No leave or outpass requests found.
            </div>
          )}
        </div>
      )}

      {/* ── 3. VISITOR PASSES ── */}
      {subTab === 'visitors' && (
        <div className="space-y-4">
          {visitors.length > 0 ? (
            visitors.map((v) => (
              <div key={v._id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-purple-400 font-bold">{v.passNumber}</span>
                    <strong className="text-white text-sm">{v.visitorName} ({v.relationship})</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 uppercase">
                    {v.status}
                  </span>
                </div>
                <div className="text-slate-300">Purpose: {v.purpose} · Phone: {v.phone}</div>
                <div className="text-slate-500 text-[11px]">
                  Visit Date: {new Date(v.visitDate).toLocaleDateString()} · Host: {v.student?.name || 'Resident'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">No visitors logged.</div>
          )}
        </div>
      )}

      {/* ── 4. ATTENDANCE STREAM ── */}
      {subTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Global Student Attendance Feed ({attendance.length} Total)</h3>
            <div className="space-y-2">
              {attendance.slice(0, 15).map((att) => (
                <div key={att._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{att.student?.name || 'Student Resident'}</div>
                    <div className="text-[11px] text-slate-500">{new Date(att.date).toLocaleString()} · {att.remarks || 'QR Verified'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase text-[10px]">
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
