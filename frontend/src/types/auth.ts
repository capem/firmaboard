export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company?: {
    name: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'RATE_LIMIT_EXCEEDED' | 'NETWORK_ERROR' | 'INVALID_TOKEN' | 'UNKNOWN';
  message: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: AuthError }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

export interface AuthTokens {
  access: string;
  refresh: string;
} 