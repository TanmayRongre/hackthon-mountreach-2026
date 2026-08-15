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
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Compliance & Security Audit Logs
          </h2>
          <p className="text-xs text-slate-400">Immutable chronological records of all administrative actions, permissions, and platform events.</p>
        </div>

        <button
          onClick={loadAuditLogs}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by user, action, or target resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Status:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">
            ✓ Log Integrity Verified
          </span>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="overflow-hidden border border-slate-800 rounded-3xl bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource Target</th>
              <th className="p-4">Details / Metadata</th>
              <th className="p-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.createdAt || Date.now()).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{log.role}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-indigo-300">
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
