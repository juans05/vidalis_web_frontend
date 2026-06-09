import axios from 'axios';
import { useAuthStore } from '../store/auth';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Interceptor para agregar token
        this.client.interceptors.request.use((config) => {
            const { token } = useAuthStore.getState();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        // Interceptor para manejo de errores
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    get(url, config) {
        return this.client.get(url, config);
    }
    post(url, data, config) {
        return this.client.post(url, data, config);
    }
    patch(url, data, config) {
        return this.client.patch(url, data, config);
    }
    delete(url, config) {
        return this.client.delete(url, config);
    }
}
export const api = new ApiClient();
//# sourceMappingURL=api.js.map