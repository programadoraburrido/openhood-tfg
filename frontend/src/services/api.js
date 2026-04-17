import axios from 'axios';

// URL base del backend
const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
});

// Interceptor para añadir el Token automáticamente a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;