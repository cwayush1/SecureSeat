import axios from 'axios';

// Connects to your Node.js Backend
export const backendAPI = axios.create({
    baseURL: import.meta.env.VITE_RENDER_API_URL || 'http://localhost:5000/api', 
    withCredentials: true
});

// Interceptor for checking token in localStorage is no longer needed since we use cookies
backendAPI.interceptors.request.use((config) => {
    return config;
});

// Connects directly to your Python AI Service
export const aiAPI = axios.create({
    // Uses Vercel's env variable in production, falls back to localhost for local development
    baseURL: import.meta.env.VITE_AI_API_URL || 'http://localhost:8000',
});