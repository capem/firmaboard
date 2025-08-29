"use client"
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { setApiTenant } from '@/config/api';

export interface TenantContextType {
  tenantSlug: string | null;
  // Prefix a relative app path with the tenant segment if present
  tenantPath: (path: string) => string;
}

const TenantContext = React.createContext<TenantContextType | null>(null);

function extractTenantFromPath(pathname: string): string | null {
  // Matches /t/<slug>(/...) optionally, returns <slug>
  const match = pathname.match(/^\/t\/([^\/?#]+)(?:[\/?#]|$)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const tenantSlug = React.useMemo(() => extractTenantFromPath(location.pathname), [location.pathname]);

  const tenantPath = React.useCallback(
    (path: string) => {
      const normalized = path.startsWith('/') ? path : `/${path}`;
      return tenantSlug ? `/t/${tenantSlug}${normalized}` : normalized;
    },
    [tenantSlug]
  );

  React.useEffect(() => {
    // Push tenant to API client so every request carries the tenant header
    setApiTenant(tenantSlug);
  }, [tenantSlug]);

  const value = React.useMemo(() => ({ tenantSlug, tenantPath }), [tenantSlug, tenantPath]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const ctx = React.useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within a TenantProvider');
  return ctx;
};

