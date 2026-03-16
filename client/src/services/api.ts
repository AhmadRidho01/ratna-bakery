import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// HAPUS interceptor redirect window.location.href
// Redirect 401 ditangani oleh ProtectedRoute, bukan di sini
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cukup reject, biarkan caller yang handle
    return Promise.reject(error);
  },
);

export default api;
