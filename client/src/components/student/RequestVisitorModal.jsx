import React, { useState } from 'react';
import { X, UserPlus, Users, Phone, Calendar, Clock, AlertCircle, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import api from '../../services/api';

export default function RequestVisitorModal({ isOpen, onClose, student, user, onVisitorCreated }) {
  const [formData, setFormData] = useState({
    visitorName: 'Rajesh Sharma',
    relationship: 'Parent',
    phone: '+91 98765 43210',
    visitDate: new Date().toISOString().split('T')[0],
    purpose: 'Delivering semester essential items & academic textbooks',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDemoFill = () => {
    setFormData({
      visitorName: 'Rajesh Sharma',
      relationship: 'Parent',
      phone: '+91 98765 43210',
      visitDate: new Date().toISOString().split('T')[0],
      purpose: 'Delivering semester essential items & academic textbooks',
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.visitorName.trim() || !formData.phone.trim() || !formData.purpose.trim()) {
      setError('Please fill in visitor name, phone, and purpose of visit');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createVisitor({
        ...formData,
        student: user?._id,
      });

      if (res.success) {
        onVisitorCreated(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to request visitor pass');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-[#0f1b2d] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Request Visitor Gatepass</h3>
              <p className="text-[11px] text-slate-400">Guest & parent campus entry permission</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDemoFill}
              className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold hover:bg-purple-500/30 transition-colors cursor-pointer"
            >
              ✨ Demo Fill
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Visitor Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma"
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Relationship *</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Parent">Parent (Father/Mother)</option>
                <option value="Guardian">Guardian</option>
                <option value="Sibling">Sibling (Brother/Sister)</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend / Peer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Visitor Contact Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date of Visit *</label>
              <input
                type="date"
                required
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Purpose of Visit *</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Meeting student, delivering semester study supplies..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Visitor request will be routed directly to your Hostel Warden for review & gate clearance.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting Request...' : 'Send to Warden for Approval →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
