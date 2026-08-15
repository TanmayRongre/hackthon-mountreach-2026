import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Send
} from 'lucide-react';
import api from '../../services/api';

export default function AdminNoticesSection({ onNoticesUpdated }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'normal',
    targetAudience: 'all',
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await api.getNotices();
      setNotices(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await api.createNotice(formData);
      showToast('Notice broadcasted to campus portal successfully!');
      setModalOpen(false);
      setFormData({ title: '', content: '', category: 'General', priority: 'normal', targetAudience: 'all' });
      loadNotices();
      if (onNoticesUpdated) onNoticesUpdated();
    } catch (err) {
      showToast(err.message || 'Failed to publish notice', 'error');
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await api.deleteNotice(id);
      showToast('Notice deleted');
      loadNotices();
    } catch (err) {
      showToast(err.message || 'Failed to delete notice', 'error');
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            Notice & Announcement Broadcast Hub
          </h2>
          <p className="text-xs text-slate-400">Publish urgent campus alerts, mess circulars, maintenance schedules, and warden updates.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.length > 0 ? (
          notices.map((n) => (
            <div key={n._id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    n.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    n.priority === 'important' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {n.priority} · {n.category || 'General'}
                  </span>
                  <button
                    onClick={() => handleDeleteNotice(n._id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white">{n.title}</h3>
                <p className="text-xs text-slate-300/90 leading-relaxed">{n.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audience: <strong className="text-slate-300 capitalize">{n.targetAudience}</strong></span>
                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-xs text-slate-500">
            No notices published yet.
          </div>
        )}
      </div>

      {/* ── MODAL: PUBLISH NOTICE ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0f1b2d] border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                Publish Campus Notice
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Hostel Maintenance & Wi-Fi Upgrade"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Students & Wardens</option>
                    <option value="students">Students Only</option>
                    <option value="wardens">Wardens Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice announcement details..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
