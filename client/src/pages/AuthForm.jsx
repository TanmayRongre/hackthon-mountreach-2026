import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css';

export default function AuthForm({ initialActive = false }) {
  const [isActive, setIsActive] = useState(initialActive);
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'warden' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('student');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot Password & SSO Modal States
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [ssoModal, setSsoModal] = useState(null); // 'google' | 'microsoft' | 'github'

  // Sync state with URL if user navigates between /login and /register
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsActive(true);
    } else if (location.pathname === '/login') {
      setIsActive(false);
    }
  }, [location.pathname]);

  const handleToggle = (active) => {
    setIsActive(active);
    setLoginError('');
    setRegisterError('');
    setRegisterSuccess('');
    if (active) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      const role = res?.user?.role || selectedRole;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'warden') {
        navigate('/warden');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid username/email or password credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await register(registerName, registerEmail, registerPassword, registerRole);
      setRegisterSuccess('Account registered successfully! Redirecting...');
      const role = res?.user?.role || registerRole;
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'warden') {
          navigate('/warden');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } catch (err) {
      setRegisterError(err.message || 'Failed to create account');
    } finally {
      setRegisterLoading(false);
    }
  };

  const autofillDemo = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setLoginEmail('admin@mountreach.com');
      setLoginPassword('admin123');
    } else if (role === 'warden') {
      setLoginEmail('warden@mountreach.com');
      setLoginPassword('warden123');
    } else {
      setLoginEmail('developer@mountreach.com');
      setLoginPassword('dev123456');
    }
  };

  const handleSendReset = (e) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background with theme overlay */}
      <div className="auth-bg-image" />
      <div className="auth-bg-overlay" />

      <div className={`auth-container container ${isActive ? 'active' : ''}`}>

        {/* ── MOBILE SWITCHER BAR (visible only on screens <= 700px) ── */}
        <div className="mobile-auth-switcher">
          <button
            type="button"
            className={`mobile-switcher-btn ${!isActive ? 'active' : ''}`}
            onClick={() => handleToggle(false)}
          >
            <i className="bx bx-log-in-circle" style={{ marginRight: 6 }}></i>
            Login
          </button>
          <button
            type="button"
            className={`mobile-switcher-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleToggle(true)}
          >
            <i className="bx bx-user-plus" style={{ marginRight: 6 }}></i>
            Register
          </button>
        </div>

        {/* ════════════════════════════════════════
            LOGIN FORM BOX
            ════════════════════════════════════════ */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your College Hostel portal
            </p>

            {/* Portal Role Tabs */}
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab-btn ${selectedRole === 'student' ? 'active student' : ''}`}
                onClick={() => autofillDemo('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`role-tab-btn ${selectedRole === 'warden' ? 'active warden' : ''}`}
                onClick={() => autofillDemo('warden')}
              >
                🏫 Warden
              </button>
              <button
                type="button"
                className={`role-tab-btn ${selectedRole === 'admin' ? 'active admin' : ''}`}
                onClick={() => autofillDemo('admin')}
              >
                🛡️ Admin
              </button>
            </div>

            {loginError && (
              <div className="auth-alert error">
                <i className="bx bx-error-circle" style={{ fontSize: 16 }}></i>
                {loginError}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Enrollment No / Email / Username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <i className="bx bxs-user input-icon"></i>
            </div>

            <div className="input-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
              </button>
            </div>

            <div className="forgot-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setForgotModal(true);
                  setForgotSent(false);
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn-primary-auth" disabled={loginLoading}>
              <i className="bx bx-log-in-circle" style={{ fontSize: 18 }}></i>
              {loginLoading ? 'Signing In...' : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </button>

            {/* Quick Demo Credentials */}
            <div className="demo-credentials">
              <button
                type="button"
                className="demo-chip"
                onClick={() => autofillDemo('student')}
                title="Fill Student credentials"
              >
                🎓 Demo Student
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => autofillDemo('warden')}
                title="Fill Warden credentials"
              >
                🏫 Demo Warden
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => autofillDemo('admin')}
                title="Fill Admin credentials"
              >
                🛡️ Demo Admin
              </button>
            </div>

            <div className="divider-text">Institutional Single Sign-On</div>

            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Google Workspace SSO'); }} title="College Google Workspace SSO">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Microsoft Azure AD SSO'); }} title="Institutional Microsoft SSO">
                <i className="bx bxl-microsoft"></i>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Campus GitHub Organization'); }} title="GitHub SSO">
                <i className="bx bxl-github"></i>
              </a>
            </div>
          </form>
        </div>

        {/* ════════════════════════════════════════
            REGISTER FORM BOX
            ════════════════════════════════════════ */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Portal Account</h1>
            <p className="auth-subtitle">
              Register as Student, Warden, or Administrator
            </p>

            {registerError && (
              <div className="auth-alert error">
                <i className="bx bx-error-circle" style={{ fontSize: 16 }}></i>
                {registerError}
              </div>
            )}
            {registerSuccess && (
              <div className="auth-alert success">
                <i className="bx bx-check-circle" style={{ fontSize: 16 }}></i>
                {registerSuccess}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name (as per College ID)"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <i className="bx bxs-user input-icon"></i>
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Official College Email ID"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <i className="bx bxs-envelope input-icon"></i>
            </div>

            <div className="input-box">
              <select
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
              >
                <option value="student">🎓 Role: Student / Resident</option>
                <option value="warden">🏫 Role: Warden Staff</option>
                <option value="admin">🛡️ Role: Administrator (Admin)</option>
              </select>
              <i className="bx bx-chevron-down input-icon"></i>
            </div>

            <div className="input-box">
              <input
                type={showRegPassword ? 'text' : 'password'}
                placeholder="Create Secure Password (min 6 chars)"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegPassword(!showRegPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={`bx ${showRegPassword ? 'bx-show' : 'bx-hide'}`}></i>
              </button>
            </div>

            <button type="submit" className="btn-primary-auth" disabled={registerLoading}>
              <i className="bx bx-user-plus" style={{ fontSize: 18 }}></i>
              {registerLoading ? 'Creating Account...' : 'Register Account'}
            </button>

            <div className="divider-text">Institutional Portal Verification</div>

            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Google Workspace SSO'); }} title="Verify with Google">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Microsoft Azure AD SSO'); }} title="Verify with Microsoft">
                <i className="bx bxl-microsoft"></i>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setSsoModal('Campus GitHub Organization'); }} title="Verify with GitHub">
                <i className="bx bxl-github"></i>
              </a>
            </div>
          </form>
        </div>

        {/* ════════════════════════════════════════
            SLIDING TOGGLE PANEL (Desktop / Tablet)
            ════════════════════════════════════════ */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <div className="badge-pill">
              <i className="bx bx-building-house"></i>
              HostelHub Portal
            </div>
            <h1>New to HostelHub?</h1>
            <p>
              Register with your student details to apply for hostel rooms, access the mess schedule, and track complaints.
            </p>
            <button
              type="button"
              className="btn-toggle-outline"
              onClick={() => handleToggle(true)}
            >
              Create Account
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <div className="badge-pill">
              <i className="bx bx-shield-quarter"></i>
              Unified Access
            </div>
            <h1>Welcome Back!</h1>
            <p>
              Already registered? Sign in to access your student, warden, or administrative hostel dashboard.
            </p>
            <button
              type="button"
              className="btn-toggle-outline"
              onClick={() => handleToggle(false)}
            >
              Sign In
            </button>
          </div>
        </div>

      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0f1b2d] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Reset Account Password</h3>
              <button
                onClick={() => setForgotModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
                <div className="font-bold">✓ Password Reset Link Dispatched</div>
                <p>If an account with <strong>{forgotEmail || 'your email'}</strong> exists in our records, a secure password reset link has been dispatched to your inbox.</p>
                <button
                  onClick={() => setForgotModal(false)}
                  className="w-full py-2 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Enter your registered institutional college email. We will generate an encrypted password reset link.
                </p>
                <input
                  type="email"
                  placeholder="name@mountreach.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── SSO INFO MODAL ── */}
      {ssoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0f1b2d] border border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
              🏢
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{ssoModal}</h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Campus Single Sign-On requires institutional SAML 2.0 / OAuth2 credentials issued by MountReach IT Services.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              For demo access, please use the quick <strong>Demo Student</strong>, <strong>Demo Warden</strong>, or <strong>Demo Admin</strong> one-click login buttons.
            </div>
            <button
              onClick={() => setSsoModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}