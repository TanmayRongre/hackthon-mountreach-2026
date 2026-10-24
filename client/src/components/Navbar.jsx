import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Home,
  LayoutDashboard,
  ShieldCheck,
  Mail,
  LogOut,
  Menu,
  X
} from 'lucide-react';

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

  const getDashboardIcon = () => {
    if (user?.role === 'admin') return <ShieldCheck className="w-3.5 h-3.5" />;
    if (user?.role === 'warden') return <Building2 className="w-3.5 h-3.5" />;
    return <LayoutDashboard className="w-3.5 h-3.5" />;
  };

  const navLinks = [
    { to: '/', label: 'Overview', icon: <Home className="w-3.5 h-3.5" /> },
    ...(isAuthenticated ? [
      {
        to: getDashboardPath(),
        label: getDashboardLabel(),
        icon: getDashboardIcon()
      },
    ] : []),
    { to: '/contact', label: 'Office & Inquiries', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090b10]/92 border-b border-white/[0.08] shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── BRAND ── */}
          <Link to="/" className="flex items-center gap-3 text-decoration-none group">
            <div className="w-8 h-8 rounded-md bg-[#131722] border border-[#c5a059]/40 flex items-center justify-center shadow-md group-hover:border-[#dfba73] transition-colors flex-shrink-0">
              <Building2 className="w-4 h-4 text-[#dfba73]" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg tracking-tight text-white leading-none">
                Hostel<span className="text-[#dfba73]">Hub</span>
              </div>
              <div className="text-[9px] text-[#94a3b8] font-sans font-medium tracking-[0.16em] uppercase mt-0.5">
                Campus Residence System
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-slate-400">{link.icon}</span>
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
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#121620] border border-white/[0.07] text-[11px] font-mono hover:border-[#c5a059]/40 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                {serverStatus.online && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus.online === null ? 'bg-amber-400' : serverStatus.online ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className="text-slate-400 text-[10px]">
                {serverStatus.online === null ? 'Checking…' : serverStatus.online ? `${serverStatus.latency}ms` : 'Offline'}
              </span>
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  title={`Open ${getDashboardLabel()}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                    (isActive('/dashboard') || isActive('/admin') || isActive('/warden'))
                      ? 'bg-[#c5a059]/15 border-[#c5a059]/40 text-white'
                      : 'bg-[#121620] border-white/[0.08] text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="w-5 h-5 rounded bg-[#182030] text-[#dfba73] border border-[#c5a059]/30 flex items-center justify-center text-[10px] font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline truncate max-w-[100px]">
                    {user?.name}
                  </span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                    user?.role === 'admin'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : user?.role === 'warden'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#c5a059]/15 text-[#dfba73] border border-[#c5a059]/30'
                  }`}>
                    {user?.role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-950/25 hover:bg-rose-900/40 border border-rose-800/30 text-rose-300 text-xs font-medium transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white text-xs font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-md bg-[#c5a059] hover:bg-[#dfba73] text-[#090b10] text-xs font-semibold shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md bg-[#121620] border border-white/[0.08] text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* ── MOBILE MENU DRAWER ── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0e1219] border-b border-white/[0.08] px-4 py-3 space-y-2 animate-fade-in shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium ${
                  isActive(link.to)
                    ? 'bg-white/[0.08] text-[#dfba73] border border-white/[0.12]'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-slate-400">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{user?.name} ({user?.role})</span>
                </div>
                <button
                  onClick={logout}
                  className="text-rose-400 font-medium hover:underline"
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
