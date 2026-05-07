import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if it's genuinely an invalid token or just a lack of permissions.
            const message = error.response?.data?.message?.toLowerCase() || '';
            const isAuthError = message.includes('token') || message.includes('expired') || message.includes('unauthorized') || message.includes('pending') || message.includes('invalid');

            // If the backend sends 401 for permissions (some old backends do instead of 403), 
            // we don't want to log the user out entirely. We only log out on real auth failures.
            if (isAuthError || !window.location.pathname.includes('/mess-dashboard')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                window.location.href = '/login';
            } else {
                console.warn('Backend returned 401, possibly due to strict route permissions on this role. Bypassing logout.');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
