import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Download,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

export default function AdminFinanceSection({ onFinanceUpdated }) {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create Fee Modal
  const [createModal, setCreateModal] = useState(false);
  const [feeForm, setFeeForm] = useState({
    student: '',
    title: 'Semester 1 Hostel Fee',
    amount: 39000,
    feeType: 'Hostel Fee',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const [feesRes, studentsRes] = await Promise.allSettled([
        api.getFees(),
        api.getStudents(),
      ]);

      if (feesRes.status === 'fulfilled' && feesRes.value.data) setFees(feesRes.value.data);
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data) setStudents(studentsRes.value.data);
    } catch (err) {
      showToast(err.message || 'Failed to load financial records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const handleCreateFee = async (e) => {
    e.preventDefault();
    if (!feeForm.student) {
      showToast('Please select a student', 'error');
      return;
    }
    try {
      await api.createFee(feeForm);
      showToast('Fee invoice created successfully!');
      setCreateModal(false);
      loadFinanceData();
      if (onFinanceUpdated) onFinanceUpdated();
    } catch (err) {
      showToast(err.message || 'Failed to create fee invoice', 'error');
    }
  };

  const totalInvoiced = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount || 0), 0);
  const rate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 100;

  const filteredFees = fees.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return f.title?.toLowerCase().includes(term) || f.student?.name?.toLowerCase().includes(term) || f.receiptNumber?.toLowerCase().includes(term);
  });

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

      {/* Top Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Invoiced</span>
          <div className="text-2xl font-black text-white font-mono mt-1">₹{totalInvoiced.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500">{fees.length} Total Invoices</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-emerald-400">Collected Revenue</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-500 font-medium">✓ Verified Payments</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-amber-400">Outstanding Dues</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-amber-500 font-medium">Pending clearance</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-semibold text-indigo-400">Collection Rate</span>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">{rate}%</div>
          <div className="text-[11px] text-slate-400">Efficiency benchmark</div>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, invoice title, or receipt ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'pending', 'paid'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                  statusFilter === st ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden border border-slate-800 rounded-3xl bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="p-4">Student</th>
              <th className="p-4">Invoice Title</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Receipt Ref</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredFees.length > 0 ? (
              filteredFees.map((f) => (
                <tr key={f._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{f.student?.name || 'Resident Student'}</td>
                  <td className="p-4 text-slate-300">{f.title}</td>
                  <td className="p-4 font-bold text-white font-mono">₹{f.amount?.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-400">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="p-4 font-mono text-[11px] text-indigo-400">{f.receiptNumber || 'Pending'}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      f.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No fee records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL: GENERATE INVOICE ── */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0f1b2d] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                Generate Student Fee Invoice
              </h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Student *</label>
                <select
                  required
                  value={feeForm.student}
                  onChange={(e) => setFeeForm({ ...feeForm, student: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Student...</option>
                  {students.map((s) => (
                    <option key={s.user?._id || s._id} value={s.user?._id || s.user}>
                      {s.user?.name || s.enrollmentNumber} ({s.enrollmentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Invoice Title *</label>
                <input
                  type="text"
                  required
                  value={feeForm.title}
                  onChange={(e) => setFeeForm({ ...feeForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={feeForm.dueDate}
                    onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
