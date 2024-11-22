import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const useVideoStore = create((set) => ({
  videos: [],
  video: null,
  loading: false,
  error: null,

  // Videoları getir
  fetchVideos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      set({ videos: response.data, loading: false });
    } catch (error) {
      set({ error: "Videolar getirilemedi.", loading: false });
    }
  },

  // Belirli bir videoyu getir
  fetchVideoById: async (key) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/videos/${key}`);
      set({ video: response.data, loading: false });
      return response.data.signedUrl; // Signed URL döndür
    } catch (error) {
      set({ error: "Video bulunamadı.", loading: false });
      throw error;
    }
  },

  // Videoyu sil
  deleteVideo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/videos/${id}`);
      set((state) => ({
        videos: state.videos.filter((video) => video.key !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Video silinemedi.", loading: false });
    }
  },
}));

export default useVideoStore;
