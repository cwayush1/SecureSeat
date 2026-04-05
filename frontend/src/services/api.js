import axios from 'axios';

// Connects to your Node.js Backend
export const backendAPI = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// Automatically attach the JWT token to every request if the user is logged in
backendAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Connects directly to your Python AI Service
export const aiAPI = axios.create({
    baseURL: 'http://localhost:8000',
});