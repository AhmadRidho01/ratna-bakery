import { create } from "zustand";
import api from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true, // ✅ true agar App.tsx langsung tampil spinner saat pertama mount
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{
        success: boolean;
        data: { user: User };
      }>("/auth/login", { email, password });

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    // isLoading sudah true dari initial state, tidak perlu set lagi
    try {
      const response = await api.get<{
        success: boolean;
        data: User;
      }>("/auth/me");
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      }); // ✅
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false }); // ✅
    }
  },
}));

export default useAuthStore;
