import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Table,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';
import api from '../../services/api';

export default function AdminReportsSection() {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleExportCSV = async (reportType, filename) => {
    setExporting(true);
    try {
      const res = await api.getAdminReports(reportType);
      const data = res.data || [];
      if (data.length === 0) {
        showToast('No records available to export for this report', 'error');
        return;
      }

      // Convert JSON to CSV
      const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${filename}.csv successfully!`);
    } catch (err) {
      showToast(err.message || 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const reportModules = [
    {
      id: 'students',
      name: 'Student Residency Roster',
      desc: 'Complete directory of all admitted students, enrollment numbers, rooms, and guardian contacts.',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      filename: 'hostelhub_students_roster',
    },
    {
      id: 'occupancy',
      name: 'Hostel & Bed Occupancy Report',
      desc: 'Summary of all hostel complexes, room allotment states, capacity, and current vacancy counts.',
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      filename: 'hostelhub_occupancy_report',
    },
    {
      id: 'finance',
      name: 'Financial Ledger & Invoices',
      desc: 'All student semester fee records, collected amounts, payment reference IDs, and outstanding dues.',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      filename: 'hostelhub_financial_ledger',
    },
    {
      id: 'complaints',
      name: 'Grievance & Resolution Log',
      desc: 'Audit of all maintenance tickets, categories, turnaround times, and resolution logs.',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      filename: 'hostelhub_complaints_log',
    },
  ];

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Executive Reports & Data Export Center
          </h2>
          <p className="text-xs text-slate-400">Generate compliance-ready CSV datasets and administrative audit reports.</p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportModules.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  {rep.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{rep.name}</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Format: .CSV / Excel</span>
                </div>
              </div>
              <p className="text-xs text-slate-300/80 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleExportCSV(rep.id, rep.filename)}
                disabled={exporting}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dataset (.CSV)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
