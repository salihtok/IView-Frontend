import { create } from "zustand";
import axios from "../config/axios.config";

const API_URL = import.meta.env.VITE_API_URL;

const useGenerateInterviewStore = create((set) => ({
  interviewLink: null,
  loading: false,
  error: null,

  // Mülakat linki oluşturma
  generateInterviewLink: async (interviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/links/${interviewId}/generate-link`
      );
      set({ interviewLink: response.data.interviewLink, loading: false });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Mülakat linki oluşturulamadı";
      set({ error: errorMessage, loading: false });
    }
  },

  // Hata temizleme
  clearError: () => set({ error: null }),

  // State temizleme
  resetStore: () => set({ interviewLink: null }),
}));

export default useGenerateInterviewStore;