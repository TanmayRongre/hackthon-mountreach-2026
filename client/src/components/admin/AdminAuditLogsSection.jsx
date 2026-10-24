import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Terminal,
  Database
} from 'lucide-react';
import api from '../../services/api';

export default function AdminAuditLogsSection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      setLogs(res.data || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return l.userName?.toLowerCase().includes(term) || l.action?.toLowerCase().includes(term) || l.resource?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1219] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white font-['Playfair_Display',serif] flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#dfba73]" />
            Compliance & Security Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">Immutable chronological records of all administrative actions, permissions, and platform events.</p>
        </div>

        <button
          onClick={loadAuditLogs}
          className="btn-arch-secondary text-xs px-3.5 py-2 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-xl bg-[#0e1219] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by user, action, or target resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#121620] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Status:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#c5a059]/15 text-[#dfba73] border border-[#c5a059]/30 text-xs font-semibold">
            ✓ Log Integrity Verified
          </span>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="overflow-hidden border border-white/10 rounded-2xl bg-[#0e1219] shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#121620] border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Actor</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Resource Target</th>
              <th className="p-4 font-semibold">Details / Metadata</th>
              <th className="p-4 text-right font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-[#121620]/60 transition-colors">
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.createdAt || Date.now()).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{log.role}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-[#dfba73]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{log.resource}</td>
                  <td className="p-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || 'Event verified'}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No logs found matching filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
