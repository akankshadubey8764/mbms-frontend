import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the auth token
axiosInstance.interceptors.request.use(
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

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized: Clear storage and redirect to login
            // Only redirect if we are NOT already on the login page
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userData');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
