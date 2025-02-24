import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Login from '@/components/auth/Login';
import Onboarding from '@/components/onboarding/Onboarding';
import { Dashboard } from '@/components/dashboard/Dashboard';
import Home from '@/components/home/Home';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="firmaboard-theme">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Protected routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
