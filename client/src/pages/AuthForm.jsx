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
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.message || 'Invalid username/email or password');
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
      await register(registerName, registerEmail, registerPassword, registerRole);
      setRegisterSuccess('Account registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
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
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
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

            <div className="divider-text">or sign in with SSO</div>

            <div className="social-icons">
              <a href="#" onClick={(e) => e.preventDefault()} title="College Google Workspace SSO">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} title="Institutional Microsoft SSO">
                <i className="bx bxl-microsoft"></i>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} title="GitHub SSO">
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
            <h1>Student Registration</h1>
            <p className="auth-subtitle">
              Create your HostelHub portal account
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
              <a href="#" onClick={(e) => e.preventDefault()} title="Verify with Google">
                <i className="bx bxl-google"></i>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} title="Verify with Microsoft">
                <i className="bx bxl-microsoft"></i>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} title="Verify with GitHub">
                <i className="bx bxl-github"></i>
              </a>
            </div>
          </form>
        </div>

        {/* ════════════════════════════════════════
            SLIDING TOGGLE PANEL (Desktop / Tablet)
            ════════════════════════════════════════ */}
        <div className="toggle-box">
          {/* Left panel (shows when on Login view, prompts to Register) */}
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

          {/* Right panel (shows when on Register view, prompts to Login) */}
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
    </div>
  );
}