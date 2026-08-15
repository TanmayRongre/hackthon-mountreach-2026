import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, MapPin, Clock, Camera } from 'lucide-react';
import api from '../../services/api';

export default function ScanAttendanceModal({ isOpen, onClose, student, user, onAttendanceMarked }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleScan = async () => {
    setError('');
    setScanning(true);
    setScanResult(null);

    try {
      // Simulate real scanning delay
      await new Promise((r) => setTimeout(r, 1200));

      const res = await api.scanAttendance({
        student: user?._id,
        hostel: student?.hostel?._id || student?.hostel,
        room: student?.room?._id || student?.room,
      });

      if (res.success) {
        setScanResult(res);
        onAttendanceMarked(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify attendance scan');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f1b2d] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Smart Attendance Terminal</h3>
              <p className="text-[11px] text-slate-400">Scan Hostel QR to mark daily presence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Viewfinder Box */}
        <div className="p-6 space-y-5 text-center">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {scanResult ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">
                {scanResult.alreadyMarked ? 'Already Verified!' : 'Attendance Marked Present!'}
              </h4>
              <p className="text-xs text-emerald-300/90">{scanResult.message}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-900/50 flex items-center justify-center gap-4">
                <span>Time: {new Date().toLocaleTimeString()}</span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto w-64 h-64 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Animated Scan Line */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#818cf8] animate-bounce z-10" />
              )}

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-indigo-400" />

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <QrCode className="w-20 h-20 text-indigo-400/80 mx-auto" />
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {student?.hostel?.code || 'SAY-A'} · Room {student?.room?.roomNumber || '101'}
                </div>
              </div>
            </div>
          )}

          {/* Geo Location & Scanner Info */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                Hostel Terminal:
              </span>
              <strong className="text-white">{student?.hostel?.name || 'Block A Complex'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Student Roll ID:
              </span>
              <strong className="text-white uppercase">{student?.enrollmentNumber || 'CS2026-088'}</strong>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            {!scanResult ? (
              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Scanning & Verifying QR...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Scan QR & Mark Attendance</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Scanner
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
