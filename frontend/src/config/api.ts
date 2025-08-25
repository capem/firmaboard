import axios from 'axios';

// API Configuration
const API_CONFIG = {
    development: {
        baseURL: 'http://localhost:8000',
        apiPrefix: '/api'
    },
    production: {
        baseURL: import.meta.env.VITE_API_URL || 'https://api.firmaboard.com',
        apiPrefix: '/api'
    },
    test: {
        baseURL: 'http://localhost:8000',
        apiPrefix: '/api'
    }
};

const environment = import.meta.env.MODE || 'development';
const config = API_CONFIG[environment as keyof typeof API_CONFIG];

// Create axios instance
export const api = axios.create({
    baseURL: `${config.baseURL}${config.apiPrefix}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    // Check sessionStorage first (for non-remember-me sessions)
    const sessionToken = sessionStorage.getItem('auth_token');
    const token = sessionToken || localStorage.getItem('auth_token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for auth token
api.interceptors.response.use(
    async (response) => {
        const authToken = response.headers['authorization'];
        if (authToken) {
            const token = authToken.split('Bearer ')[1];
            if (token) {
                // Store in the same storage that was used for the original token
                if (sessionStorage.getItem('auth_token')) {
                    sessionStorage.setItem('auth_token', token);
                } else {
                    localStorage.setItem('auth_token', token);
                }
            }
        }
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
        }
        throw error;
    }
);

// API Endpoints
export const ENDPOINTS = {
    auth: {
        register: '/core/register/',
        login: '/core/login/',
        logout: '/core/logout/',
        session: '/core/session/',
        completeOnboarding: '/core/complete-onboarding/',
        setupCompanyProfile: '/core/setup-company-profile/',
        googleOAuth: '/core/oauth/google/'
    },
    farms: {
        assets: '/farms/assets/'
    },
    dataImport: {
        uploads: '/data-import/uploads/'
    }
} as const; 
