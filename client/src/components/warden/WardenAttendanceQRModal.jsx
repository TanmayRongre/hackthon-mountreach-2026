import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import api from '../../services/api';
import {
  QrCode,
  X,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Users,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export default function WardenAttendanceQRModal({ isOpen, onClose, hostel, attendanceList = [] }) {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const fetchOrGenerateQR = async () => {
    setLoading(true);
    setError('');
    try {
      // First check if an active session already exists today
      const activeRes = await api.getActiveAttendanceSession();
      if (activeRes?.success && activeRes?.data) {
        setSessionData(activeRes.data);
      } else {
        // Generate new session
        const genRes = await api.generateAttendanceQR({
          hostelId: hostel?._id,
        });
        if (genRes?.success && genRes?.data) {
          setSessionData(genRes.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize QR session');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const genRes = await api.generateAttendanceQR({
        hostelId: hostel?._id,
      });
      if (genRes?.success && genRes?.data) {
        setSessionData(genRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to regenerate QR session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrGenerateQR();
    }
  }, [isOpen]);

  useEffect(() => {
    if (sessionData && canvasRef.current) {
      const payloadString =
        typeof sessionData.qrPayload === 'string'
          ? sessionData.qrPayload
          : JSON.stringify(sessionData.qrPayload || { sessionToken: sessionData.sessionToken });

      QRCode.toCanvas(
        canvasRef.current,
        payloadString,
        {
          width: fullscreen ? 360 : 260,
          margin: 2,
          color: {
            dark: '#030712',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (err) => {
          if (err) console.error('QR render error:', err);
        }
      );
    }
  }, [sessionData, fullscreen]);

  if (!isOpen) return null;

  const todayStr = new Date().toDateString();
  const todayAttendedCount = attendanceList.filter(
    (a) => new Date(a.date).toDateString() === todayStr && a.status === 'present'
  ).length;

  const handleCopyCode = () => {
    if (sessionData?.sessionToken) {
      navigator.clipboard.writeText(sessionData.sessionToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div
        className={`relative w-full ${
          fullscreen ? 'max-w-2xl' : 'max-w-md'
        } bg-[#0f1b2d] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all`}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Hostel Attendance Terminal QR
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {hostel?.name || 'Campus Hostel Block'} · {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={fullscreen ? 'Exit kiosk mode' : 'Kiosk full view'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-6 space-y-5 text-center flex flex-col items-center">
          {error && (
            <div className="w-full p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <div className="text-xs text-slate-400">Generating secure QR code session...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Canvas Card */}
              <div className="relative inline-block p-4 rounded-3xl bg-white shadow-2xl border-4 border-emerald-500/30">
                <canvas ref={canvasRef} className="rounded-2xl" />
                <div className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  HostelHub Smart QR Terminal
                </div>
              </div>

              {/* Session Token & Attended Counter */}
              <div className="w-full max-w-sm p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Session Code:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {sessionData?.sessionToken || 'ATT-SAY-ACTIVE'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    Residents Present Today:
                  </span>
                  <span className="font-bold text-white px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                    {todayAttendedCount} marked
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-600/30"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
