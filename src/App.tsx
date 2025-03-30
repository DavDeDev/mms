/**
 * Main application component that handles routing and authentication state.
 * 
 * This component:
 * - Manages the application's routing logic
 * - Handles authentication state loading
 * - Protects routes that require authentication
 * - Provides toast notifications via Sonner
 */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { useAuthStore } from './store/authStore';

/**
 * ProtectedRoute component that ensures routes are only accessible to authenticated users.
 * Redirects to the auth page if user is not authenticated.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
}

/**
 * Root application component that sets up routing and authentication.
 */
function App() {
  const { loadUserFromLocalStorage } = useAuthStore();

  // Load user data from local storage on app initialization
  useEffect(() => {
    loadUserFromLocalStorage();
  }, []); // Intentionally empty deps array as this should only run once

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: 'none',
          },
          className: 'my-toast-class',
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;