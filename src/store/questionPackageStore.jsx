import { create } from "zustand";
import axios from "../config/axios.config";

// Backend API endpoint
const API_URL = import.meta.env.VITE_API_URL;

const useQuestionsPackageStore = create((set) => ({
  questions: [],
  questionPackage: null,
  loading: false,
  error: null,

  // Tüm soru paketlerini getir
  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/questionPackages`);
      set({ questions: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Error fetching question packages",
      });
    }
  },

  // Tek bir soru paketini getir
  fetchQuestionPackageById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/questionPackages/${id}`);
      set({ questionPackage: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Error fetching question package",
      });
    }
  },

  // Yeni bir soru paketi ekle
  addQuestionPackage: async (newPackage) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/questionPackages`,
        newPackage
      );
      set((state) => ({
        questions: [...state.questions, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error adding question package",
      });
    }
  },

  // Soru paketini güncelle
  updateQuestionPackage: async (id, updatedPackage) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/api/questionPackages/${id}`,
        updatedPackage
      );
      set((state) => ({
        questions: state.questions.map((pkg) =>
          pkg._id === id ? response.data : pkg
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Error updating question package",
      });
    }
  },

  // Soru paketini sil
  deleteQuestionPackage: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/questionPackages/${id}`);
      set((state) => ({
        questions: state.questions.filter((pkg) => pkg._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Error deleting question package",
      });
    }
  },
}));

export default useQuestionsPackageStore;