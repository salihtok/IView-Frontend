import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const useInterviewStore = create((set) => ({
  interviews: [],
  interview: null,
  loading: false,
  error: null,

  // Mülakatları listeleme
  fetchInterviews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/interviews`);
      set({ interviews: response.data, loading: false });
    } catch (error) {
      set({ error: "Mülakatlar alınamadı", loading: false });
    }
  },

  // Tek bir mülakatı ID ile getirme
  fetchInterviewById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/interviews/${id}`);
      set({ interview: response.data, loading: false });
    } catch (error) {
      set({ error: "Mülakat alınamadı", loading: false });
    }
  },

  // Yeni mülakat oluşturma
  createInterview: async (title, questionPackage, expireDate) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/interviews`, {
        title,
        questionPackage,
        expireDate,
      });
      set((state) => ({
        interviews: [...state.interviews, response.data.interview],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Mülakat oluşturulamadı", loading: false });
    }
  },

  // Mülakat güncelleme
  updateInterview: async (id, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/api/interviews/${id}`,
        updateData
      );
      set((state) => ({
        interviews: state.interviews.map((interview) =>
          interview._id === id ? response.data : interview
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Mülakat güncellenemedi", loading: false });
    }
  },

  // Mülakat silme
  deleteInterview: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/interviews/${id}`);
      set((state) => ({
        interviews: state.interviews.filter(
          (interview) => interview._id !== id
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Mülakat silinemedi", loading: false });
    }
  },
}));

export default useInterviewStore;
