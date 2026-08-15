import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Sparkles, 
  Layers, 
  Database, 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Server,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealthData(data))
      .catch(() => setHealthData({ success: false }));
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-sky-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>MountReach Hackathon 2026 · Full MERN Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
          High Performance{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300">
            MERN Stack
          </span>{' '}
          Platform
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Production-ready full stack environment with Express API, MongoDB Atlas, JWT authentication, secure authorization roles, and integrated verification tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
          >
            <Layers className="w-5 h-5" />
            <span>Launch Testing Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold text-base transition-all backdrop-blur-sm"
            >
              Sign Up / Get Started
            </Link>
          ) : (
            <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Signed in as {user?.name} ({user?.role})</span>
            </div>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">JWT Authentication</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bcrypt hashed passwords, signed JSON Web Tokens, cookie support, and role-based permissions (User / Admin).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md hover:border-sky-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">MongoDB & Mongoose</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Complete Items & User schemas with timestamps, relations, category filters, and owner validation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md hover:border-teal-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live API Testing Suite</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Execute live REST endpoints, monitor latency, send custom HTTP payloads, and inspect server responses.
            </p>
          </div>

        </div>

        {/* Server Status pill */}
        <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-400">
          <Server className="w-4 h-4 text-slate-400" />
          <span>Server Status:</span>
          <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {healthData?.success ? `Operational (${healthData.uptime || 'active'})` : 'Connecting...'}
          </span>
        </div>

      </div>
    </div>
  );
}
