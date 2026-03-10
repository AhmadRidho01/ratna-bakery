// Axios instance terpusat

// --- --- ---

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // penting untuk cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk handle token expired otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke login kalau token expired
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default api;
