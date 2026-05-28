import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Redirect logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Pages (Protected from logged-in users) */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Link-In-Bio Page. Keep this after fixed app routes. */}
          <Route path="/:username" element={<PublicProfile />} />

          {/* Wildcard 404 Pages */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
