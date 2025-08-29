import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, onboardingRequired } = useAuth();
  const location = useLocation();
  const { tenantPath } = useTenant();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={tenantPath('/login')} state={{ from: location }} replace />;
  }

  // If authenticated but onboarding not completed, force onboarding
  if (onboardingRequired) {
    const provider = sessionStorage.getItem('last_auth_provider') || localStorage.getItem('last_auth_provider');
    const path = provider === 'google' ? '/onboarding?google=1' : '/onboarding';
    return <Navigate to={tenantPath(path)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
