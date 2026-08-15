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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1b2d', color: '#fff' }}>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/dashboard"         element={<StudentDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/warden"            element={<WardenDashboard />} />
              <Route path="/warden-dashboard"  element={<WardenDashboard />} />
              <Route path="/admin"             element={<AdminDashboard />} />
              <Route path="/admin-dashboard"   element={<AdminDashboard />} />
              <Route path="/login"             element={<AuthForm initialActive={false} />} />
              <Route path="/register"          element={<AuthForm initialActive={true} />} />
              <Route path="/contact"           element={<Contact />} />
              <Route path="*"                  element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
