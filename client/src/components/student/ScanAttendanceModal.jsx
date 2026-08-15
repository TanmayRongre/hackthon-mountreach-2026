import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Camera,
  CameraOff,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import api from '../../services/api';

export default function ScanAttendanceModal({ isOpen, onClose, student, user, onAttendanceMarked }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const streamRef = useRef(null);
  const hasScannedRef = useRef(false);

  // Play pleasant chime on successful scan
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6 note
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext not supported or allowed
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setError('');
    setCameraError('');
    hasScannedRef.current = false;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
      }

      setCameraActive(true);
      setScanning(true);
    } catch (err) {
      console.warn('Camera start issue:', err.message);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera permissions or enter the session code.'
          : 'Could not access camera device. You can verify using the active terminal code below.'
      );
      setCameraActive(false);
      setScanning(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  };

  // Continuous frame analysis with jsQR
  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || hasScannedRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data && !hasScannedRef.current) {
          hasScannedRef.current = true;
          playBeep();
          handleProcessScannedData(code.data);
          return;
        }
      }
    }

    if (scanning && !hasScannedRef.current) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
    }
  };

  useEffect(() => {
    if (scanning && cameraActive) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [scanning, cameraActive]);

  useEffect(() => {
    if (isOpen) {
      setScanResult(null);
      setError('');
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Process decoded QR or manual session token
  const handleProcessScannedData = async (rawData) => {
    stopCamera();
    setError('');

    try {
      const res = await api.scanAttendance({
        qrData: rawData,
        sessionToken: typeof rawData === 'string' && rawData.startsWith('ATT-') ? rawData : undefined,
      });

      if (res.success) {
        setScanResult(res);
        if (onAttendanceMarked) {
          onAttendanceMarked(res.data);
        }
      } else {
        setError(res.message || 'Invalid or expired attendance QR code');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify attendance scan');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessScannedData(manualCode.trim());
  };

  // 1-Click Demo Scanner (fetches live active session or verifies instantly)
  const handleInstantDemoScan = async () => {
    setError('');
    try {
      const sessionRes = await api.getActiveAttendanceSession();
      const token = sessionRes?.data?.sessionToken || `ATT-${student?.hostel?.code || 'SAY'}-ACTIVE`;
      playBeep();
      await handleProcessScannedData(token);
    } catch (err) {
      setError(err.message || 'Failed to verify attendance');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#0f1b2d] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Attendance Scanner</h3>
              <p className="text-[11px] text-slate-400">Scan Warden's daily QR code to mark presence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden Canvas for QR video frame processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Scanner Viewfinder Box */}
        <div className="p-6 space-y-4 text-center">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {scanResult ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">
                {scanResult.alreadyMarked ? 'Already Verified!' : 'Attendance Verified Present!'}
              </h4>
              <p className="text-xs text-emerald-300/90">{scanResult.message}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-900/50 flex items-center justify-center gap-4">
                <span>Time: {new Date().toLocaleTimeString()}</span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto w-full max-w-[280px] h-[280px] rounded-3xl bg-slate-950 border-2 border-indigo-500/40 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Real Video Stream */}
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {/* Animated Optical Laser Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce z-20 pointer-events-none" />
                </>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    {cameraError ? 'Camera Mode Inactive' : 'Initializing camera...'}
                  </div>
                  {cameraError && (
                    <div className="text-[11px] text-slate-400 max-w-[220px] mx-auto">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {/* Viewfinder Target Reticle Frame */}
              <div className="absolute inset-4 pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />
              </div>

              {cameraActive && (
                <div className="absolute bottom-3 inset-x-3 z-20 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-full text-[10px] font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Align Warden's QR Code inside frame
                </div>
              )}
            </div>
          )}

          {/* Student Terminal Location Info */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                Hostel Complex:
              </span>
              <strong className="text-white">{student?.hostel?.name || 'Campus Block'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Resident Roll:
              </span>
              <strong className="text-white uppercase">{student?.enrollmentNumber || 'CS2026'}</strong>
            </div>
          </div>

          {/* Manual Input Drawer */}
          {showManualInput && !scanResult && (
            <form onSubmit={handleManualSubmit} className="space-y-2 text-left animate-fade-in">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Enter Warden QR Session Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ATT-SAY-A-XXXX"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 uppercase font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </form>
          )}

          {/* Actions */}
          <div className="pt-2 space-y-2">
            {!scanResult ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInstantDemoScan}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Instant Verify Active QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer border border-slate-700"
                    title="Enter code manually"
                  >
                    {showManualInput ? 'Camera' : 'Code'}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
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
