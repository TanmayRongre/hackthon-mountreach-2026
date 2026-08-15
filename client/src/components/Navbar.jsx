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
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/',        label: 'Home',    icon: 'bx bx-home-alt-2' },
    { to: '/contact', label: 'Contact', icon: 'bx bx-envelope' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(15, 27, 45, 0.88)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* ── BRAND ── */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}>
              <i className="bx bx-building-house" style={{ fontSize: 20, color: '#fff' }}></i>
            </div>
            <div>
              <div style={{
                fontWeight: 800,
                fontSize: 16,
                background: 'linear-gradient(135deg, #fff 40%, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}>
                HostelHub
              </div>
              <div style={{
                fontSize: 9.5,
                color: 'rgba(165,180,252,0.7)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                Management System
              </div>
            </div>
          </Link>

          {/* ── NAV LINKS (desktop) ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.18s',
                  color: isActive(link.to) ? '#fff' : 'rgba(255,255,255,0.52)',
                  background: isActive(link.to) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: isActive(link.to) ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
                }}
              >
                <i className={link.icon} style={{ fontSize: 16 }}></i>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: API Pulse + Auth ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* API Health Pill */}
            <div
              onClick={checkHealth}
              title={`Backend: ${serverStatus.online === null ? 'Checking...' : serverStatus.online ? `Online ${serverStatus.latency}ms` : 'Offline'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontSize: 11,
              }}
            >
              <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                {serverStatus.online && (
                  <span style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#34d399',
                    animation: 'ping 1.2s ease-in-out infinite',
                    opacity: 0.7,
                  }} />
                )}
                <span style={{
                  position: 'relative',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: serverStatus.online === null ? '#fbbf24' : serverStatus.online ? '#10b981' : '#ef4444',
                  display: 'inline-block',
                }} />
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                {serverStatus.online === null ? 'API…' : serverStatus.online ? `${serverStatus.latency}ms` : 'Down'}
              </span>
            </div>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                    {user?.name}
                  </span>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    background: user?.role === 'admin' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)',
                    color: user?.role === 'admin' ? '#fbbf24' : '#a5b4fc',
                    border: user?.role === 'admin' ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(99,102,241,0.35)',
                  }}>
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#fca5a5',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: "'Poppins',sans-serif",
                    transition: 'all 0.18s',
                  }}
                >
                  <i className="bx bx-log-out" style={{ fontSize: 16 }}></i>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                >
                  <i className="bx bx-log-in" style={{ fontSize: 16 }}></i>
                  Login
                </Link>

                <Link
                  to="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    transition: 'all 0.18s',
                  }}
                >
                  <i className="bx bx-user-plus" style={{ fontSize: 16 }}></i>
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  );
}
