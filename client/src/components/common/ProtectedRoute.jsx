import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Reusable Protected Route component with role-based access control
 * and full-screen loading spinner to prevent unauthenticated flash
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If auth status is still being determined on initial load
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07101f] flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 animate-pulse">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">HostelHub Verification</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticating secure session & credentials...</p>
          </div>
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // Not authenticated -> Redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: If allowedRoles is specified and user's role is not in the list
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to the user's appropriate portal
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'warden') {
      return <Navigate to="/warden" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
