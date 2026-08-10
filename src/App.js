// src/App.js

import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Topbar from './components/layout/Topbar';
import Loader from './components/common/Loader';
import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const News = lazy(() => import('./pages/News'));
const Community = lazy(() => import('./pages/Community'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));

// Route protection for dashboard pages
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

// Redirect authenticated users away from auth pages
function AuthRedirectRoute({ children, isAuthenticated }) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('currentUser');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="dashboard-container">
        {/* Render Topbar only when user is authenticated */}
        {isAuthenticated && <Topbar name={user.name} onLogout={handleLogout} />}

        <Suspense fallback={<Loader fullPage={true} message="Loading GreenGuard Portal..." />}>
          <Routes>
            {/* Public Auth Routes */}
            <Route 
              path="/signin" 
              element={
                <AuthRedirectRoute isAuthenticated={isAuthenticated}>
                  <SignIn onLoginSuccess={handleLoginSuccess} />
                </AuthRedirectRoute>
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                <AuthRedirectRoute isAuthenticated={isAuthenticated}>
                  <SignUp onLoginSuccess={handleLoginSuccess} />
                </AuthRedirectRoute>
              } 
            />

            {/* Protected Main Dashboard Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Analysis History Page */}
            <Route 
              path="/history" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <History />
                </ProtectedRoute>
              } 
            />

            {/* Contact / Feedback Page */}
            <Route 
              path="/contact" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Contact />
                </ProtectedRoute>
              } 
            />

            {/* News & Community Pages */}
            <Route 
              path="/news" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <News />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/community" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Community />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Catch-All Route */}
            <Route 
              path="*" 
              element={
                <Navigate to={isAuthenticated ? "/" : "/signin"} replace />
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}