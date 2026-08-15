import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthForm from './pages/AuthForm';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#07101f', color: '#fff' }}>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthForm initialActive={false} />} />
              <Route path="/register" element={<AuthForm initialActive={true} />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Warden Routes */}
              <Route
                path="/warden"
                element={
                  <ProtectedRoute allowedRoles={['warden', 'admin']}>
                    <WardenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warden-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['warden', 'admin']}>
                    <WardenDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
