import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: false,
  login: (token) => set({ token, isAuthenticated: true }),
  logout: () => set({ token: null, isAuthenticated: false }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ token: null, isAuthenticated: false }),
}));

export default useAuthStore;