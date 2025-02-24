import { AuthTokens } from '@/types/auth';

export const TOKEN_STORAGE_KEY = {
  AUTH: 'auth_token',
  REFRESH: 'refresh_token',
} as const;

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
  localStorage.removeItem(TOKEN_STORAGE_KEY.REFRESH);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY.REFRESH);
};

export const storeTokens = (tokens: AuthTokens, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_STORAGE_KEY.AUTH, tokens.access);
  storage.setItem(TOKEN_STORAGE_KEY.REFRESH, tokens.refresh);
};

export const getStoredToken = () => {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY.AUTH) || localStorage.getItem(TOKEN_STORAGE_KEY.AUTH);
};

export const getStoredRefreshToken = () => {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY.REFRESH) || localStorage.getItem(TOKEN_STORAGE_KEY.REFRESH);
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  return undefined;
}; 