import { create } from "zustand";
import axios from "../config/axios.config";

const API_URL = import.meta.env.VITE_API_URL;

const useQuestionsStore = create((set) => ({
  questions: [],
  loading: false,
  error: null,

  // Soruları getir
  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/questions`);
      set({ questions: response.data, loading: false });
    } catch (error) {
      // Burada error.response varsa onun mesajını yoksa genel error mesajını gösteriyoruz
      const errorMessage = error.response?.data?.message || error.message;
      set({
        error: `Failed to fetch questions: ${errorMessage}`,
        loading: false,
      });
    }
  },

  // Tek bir soruyu ID ile getir
  fetchQuestionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/questions/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        error: `Failed to fetch the question: ${errorMessage}`,
        loading: false,
      });
    }
  },

  // Yeni bir soru oluştur
  createQuestion: async (questionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/questions`,
        questionData
      );
      set((state) => ({
        questions: [...state.questions, response.data],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        error: `Failed to create question: ${errorMessage}`,
        loading: false,
      });
    }
  },

  // Varolan bir soruyu güncelle
  updateQuestion: async (id, questionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/api/questions/${id}`,
        questionData
      );
      set((state) => ({
        questions: state.questions.map((question) =>
          question._id === id
            ? { ...response.data, questionTime: response.data.questionTime }
            : question
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        error: `Failed to update question: ${errorMessage}`,
        loading: false,
      });
    }
  },

  // Bir soruyu sil
  deleteQuestion: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/questions/${id}`);
      set((state) => ({
        questions: state.questions.filter((question) => question._id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({
        error: `Failed to delete question: ${errorMessage}`,
        loading: false,
      });
    }
  },
}));

export default useQuestionsStore;