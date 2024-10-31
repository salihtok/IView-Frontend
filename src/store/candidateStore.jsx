import { create } from "zustand";
import axios from "axios";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Zustand store
const useCandidateStore = create((set) => ({
  candidates: [],
  candidate: null,
  loading: false,
  error: null,

  // Tüm adayları getirir
  getAllCandidates: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/api/candidates`);
      set({ candidates: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch candidates",
        loading: false,
      });
    }
  },

  // ID'ye göre bir adayı getirir
  getCandidateById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/api/candidates/${id}`);
      set({ candidate: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch candidate",
        loading: false,
      });
    }
  },

  // Video mülakatı tamamlama (tüm bilgileri gönderme)
  submitInterview: async ({
    interviewId,
    firstName,
    lastName,
    email,
    phone,
    kvkk,
    videoUrl,
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/candidates/submit`, {
        interviewId,
        firstName,
        lastName,
        email,
        phone,
        kvkk,
        videoUrl,
      });
      set((state) => ({
        candidates: [...state.candidates, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Mülakat tamamlanamadı";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Mevcut bir adayı günceller
  updateCandidate: async (id, updatedData) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `${API_URL}/api/candidates/${id}`,
        updatedData
      );
      set((state) => ({
        candidates: state.candidates.map((cand) =>
          cand._id === id ? response.data : cand
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update candidate",
        loading: false,
      });
    }
  },

  // Bir adayı siler
  deleteCandidate: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/api/candidates/${id}`);
      set((state) => ({
        candidates: state.candidates.filter((cand) => cand._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete candidate",
        loading: false,
      });
    }
  },

  // Fetch candidates for a specific interview
  fetchCandidatesForInterview: async (interviewId) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${API_URL}/api/candidates/${interviewId}/candidates`
      );
      set({ candidates: response.data, loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch candidates for this interview",
        loading: false,
      });
    }
  },
}));

export default useCandidateStore;