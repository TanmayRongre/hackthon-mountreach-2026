import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Activity, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Layers, 
  Server,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState({ online: null, latency: null });

  const checkHealth = async () => {
    try {
      const data = await api.getHealth();
      setServerStatus({ online: true, latency: data._latency });
    } catch {
      setServerStatus({ online: false, latency: null });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Heartbeat every 10s
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                MountReach
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 ml-1.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                2026
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              Products & Tester
            </Link>
          </nav>
        </div>

        {/* Right side: Backend Health & Auth Controls */}
        <div className="flex items-center gap-3">
          {/* Live Backend Pulse */}
          <div 
            onClick={checkHealth}
            title={`Backend Status: ${serverStatus.online === null ? 'Checking...' : serverStatus.online ? `Online (${serverStatus.latency}ms)` : 'Offline (Click to retry)'}`}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-white/20 transition-all text-xs"
          >
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                {serverStatus.online && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  serverStatus.online === null ? 'bg-amber-400' : serverStatus.online ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <span className="text-slate-300 font-mono">
                {serverStatus.online === null ? 'API...' : serverStatus.online ? `${serverStatus.latency}ms` : 'API Down'}
              </span>
            </div>
          </div>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">{user?.name}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  user?.role === 'admin' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm font-medium transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
