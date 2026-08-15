import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState({ online: null, latency: null });
  const [mobileOpen, setMobileOpen] = useState(false);

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
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'warden') return '/warden';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin Hub';
    if (user?.role === 'warden') return 'Warden Desk';
    return 'Student Portal';
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'bx bx-home-alt-2' },
    ...(isAuthenticated ? [
      {
        to: getDashboardPath(),
        label: getDashboardLabel(),
        icon: user?.role === 'admin' ? 'bx bx-shield-quarter' : user?.role === 'warden' ? 'bx bx-building' : 'bx bx-layout'
      },
    ] : []),
    { to: '/contact', label: 'Contact', icon: 'bx bx-envelope' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1b2d]/90 border-b border-slate-800/80 font-sans shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── BRAND ── */}
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform flex-shrink-0">
              <i className="bx bx-building-house text-white text-xl"></i>
            </div>
            <div>
              <div className="font-extrabold text-base bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-none">
                HostelHub
              </div>
              <div className="text-[9px] text-indigo-300/80 font-bold tracking-widest uppercase mt-0.5">
                Management System
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <i className={`${link.icon} text-base`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: Pulse + Auth + Hamburger ── */}
          <div className="flex items-center gap-3">

            {/* API Health Pill */}
            <button
              onClick={checkHealth}
              title={`Server: ${serverStatus.online === null ? 'Checking...' : serverStatus.online ? `Online (${serverStatus.latency}ms)` : 'Offline'}`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                {serverStatus.online && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus.online === null ? 'bg-amber-400' : serverStatus.online ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className="text-slate-400 text-[10px]">
                {serverStatus.online === null ? 'API…' : serverStatus.online ? `${serverStatus.latency}ms` : 'Down'}
              </span>
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  title={`Open ${getDashboardLabel()}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    (isActive('/dashboard') || isActive('/admin') || isActive('/warden'))
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline truncate max-w-[100px]">
                    {user?.name}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    user?.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : user?.role === 'warden'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {user?.role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <i className="bx bx-log-out text-sm"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              <i className={`bx ${mobileOpen ? 'bx-x' : 'bx-menu'} text-xl`}></i>
            </button>
          </div>

        </div>

        {/* ── MOBILE MENU DRAWER ── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a1424] border-b border-slate-800 px-4 py-3 space-y-2 animate-fade-in shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive(link.to)
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <i className={`${link.icon} text-base`}></i>
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{user?.name} ({user?.role})</span>
                </div>
                <button
                  onClick={logout}
                  className="text-rose-400 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
