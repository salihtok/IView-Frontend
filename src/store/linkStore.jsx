import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const useLinkStore = create((set) => ({
  interview: null,
  loading: false,
  error: null,
  interviewLink: null,

  // Mülakatı link ile getirme
  fetchInterviewByLink: async (link) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/link/${link}`);
      set({ interview: response.data, loading: false });
    } catch (error) {
      set({ error: "Mülakat bulunamadı", loading: false });
    }
  },

  // Mülakatı tamamlama (video URL gönderme)
  submitInterview: async (candidateId, videoUrl) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/api/submit`, { candidateId, videoUrl });
      set({ loading: false });
    } catch (error) {
      set({ error: "Mülakat tamamlanamadı", loading: false });
    }
  },

  // Form gönderme işlemi
  submitInterviewForm: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/submitform`, formData);
      set({ loading: false });
      return response.data.candidateId; // Eğer gerekli ise yeni oluşturulan candidateId'yi döndürebilirsiniz.
    } catch (error) {
      set({ error: "Form işlenemedi", loading: false });
    }
  },

  // Mülakat linki oluşturma
  generateInterviewLink: async (interviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/links/${interviewId}/generate-link`
      );
      set({ interviewLink: response.data.interviewLink, loading: false });
    } catch (error) {
      set({ error: "Mülakat linki oluşturulamadı", loading: false });
    }
  },

  // Hata temizleme
  clearError: () => set({ error: null }),

  // State temizleme
  resetStore: () => set({ interview: null, interviewLink: null }),
}));

export default useLinkStore;
