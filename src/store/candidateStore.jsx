import { create } from "zustand";
import axios from "axios";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Python API base URL
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL;

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

  // Update candidate status
  updateCandidateStatus: async (id, status) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `${API_URL}/api/candidates/${id}/status`,
        { status }
      );
      set((state) => ({
        candidates: state.candidates.map((candidate) =>
          candidate._id === id
            ? { ...candidate, status: response.data.status }
            : candidate
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update candidate status",
        loading: false,
      });
    }
  },
  analyzeCandidateVideo: async (candidateId, videoKey, payload) => {
    console.log("Analize giden Video Key:", videoKey);
    console.log("Analize giden Candidate ID:", candidateId);
    console.log("Analize giden Payload:", payload);

    set({ loading: true });
    try {
      // Backend'den Signed URL al
      const signedUrl = await axios
        .get(`${API_URL}/api/videos/${videoKey}`)
        .then((res) => res.data.signedUrl);

      // Python API'ye gönder
      const response = await axios.post(`${PYTHON_API_URL}/process_video`, {
        signed_url: signedUrl,
        candidate_id: candidateId,
        ...payload, // Requirements ve Questions burada gönderiliyor
      });

      console.log("Analiz Sonuçları:", response.data);
      set((state) => ({
        candidates: state.candidates.map((cand) =>
          cand._id === candidateId ? { ...cand, result: response.data } : cand
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Analiz işlemi sırasında hata oluştu:", error);
      set({
        error: error.response?.data?.message || "Failed to analyze video",
        loading: false,
      });
    }
  },
}));

export default useCandidateStore;
