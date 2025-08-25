import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ENDPOINTS } from '@/config/api';
import { useToast } from "@/hooks/use-toast"
import { AxiosError } from 'axios';
import {
  User,
  AuthError,
  AuthContextType,
  LoginCredentials,
  AuthTokens
} from '@/types/auth';
import {
  clearTokens,
  storeTokens,
  getStoredToken,
  getStoredRefreshToken
} from '@/utils/auth';

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [onboardingRequired, setOnboardingRequired] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthError = (error: unknown): AuthError => {
    const axiosError = error as AxiosError;
    const status = axiosError?.response?.status;

    let authError: AuthError = {
      code: 'UNKNOWN',
      message: 'An unexpected error occurred'
    };

    if (status === 401) {
      authError = {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      };
    } else if (status === 429) {
      authError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many login attempts. Please try again later'
      };
    } else if (axiosError.message.includes('network')) {
      authError = {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection'
      };
    }

    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: authError.message
    });

    return authError;
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        return false;
      }

      const { data } = await api.get<{ isAuthenticated: boolean; user?: User; onboarding_required?: boolean }>(ENDPOINTS.auth.session);
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setOnboardingRequired(!!data.onboarding_required);
        return true;
      } else {
        setUser(null);
        setOnboardingRequired(false);
        clearTokens();
        return false;
      }
    } catch (error) {
      const authError = handleAuthError(error);
      
      setUser(null);
      setOnboardingRequired(false);
      clearTokens();
      
      if (authError.code === 'INVALID_TOKEN') {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue"
        });
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password, rememberMe = false }: LoginCredentials): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const { data } = await api.post<{ user: User; tokens: AuthTokens }>(
        ENDPOINTS.auth.login,
        { email, password, rememberMe }
      );

      setUser(data.user);
      storeTokens(data.tokens, rememberMe);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('last_auth_provider', 'password');
      
      const onboardingRequired = !!(data as any).onboarding_required;
      setOnboardingRequired(onboardingRequired);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in"
      });

      navigate(onboardingRequired ? '/onboarding' : '/dashboard');
      return { success: true };
    } catch (error) {
      const authError = handleAuthError(error);
      return { success: false, error: authError };
    }
  };

  const loginWithGoogle = async ({ credential, rememberMe = false }: { credential: string; rememberMe?: boolean }): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const { data } = await api.post<{ user: User; tokens: AuthTokens; onboarding_required: boolean }>(
        ENDPOINTS.auth.googleOAuth,
        { id_token: credential, rememberMe }
      );
      setUser(data.user);
      storeTokens(data.tokens, rememberMe);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('last_auth_provider', 'google');
      setOnboardingRequired(!!data.onboarding_required);
      toast({ title: "Welcome!", description: "Signed in with Google" });
      const onboardingRequired = !!data.onboarding_required;
      navigate(onboardingRequired ? '/onboarding?google=1' : '/dashboard');
      return { success: true };
    } catch (error) {
      const authError = handleAuthError(error);
      return { success: false, error: authError };
    }
  };

  const logout = async () => {
    const refreshToken = getStoredRefreshToken();
    
    if (refreshToken) {
      try {
        await api.post(ENDPOINTS.auth.logout, { refresh_token: refreshToken });
      } catch (error) {
        console.warn('Error during logout:', error);
      }
    }

    setUser(null);
    setOnboardingRequired(false);
    clearTokens();
    try {
      localStorage.removeItem('last_auth_provider');
      sessionStorage.removeItem('last_auth_provider');
    } catch {}
    navigate('/login');
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      onboardingRequired,
      login,
      loginWithGoogle,
      logout,
      checkAuth,
      setUser,
      setOnboardingRequired,
    }),
    [user, isLoading, onboardingRequired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 