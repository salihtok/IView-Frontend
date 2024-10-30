// store/videoStore.js
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

  // Yükleme fonksiyonu: sadece filePath döner
  uploadVideo: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_URL}/api/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const videoData = response.data.files?.[0];
      console.log("Video data:", videoData.fileId);
      if (videoData?.fileId) {
        return videoData.fileId; // Sadece fileId’i döndürür.
      } else {
        throw new Error("Video yüklenemedi: fileId alınamadı.");
      }
    } catch (error) {
      set({ error: "Video yüklenemedi.", loading: false });
      throw error;
    }
  },

  // Belirli bir videoyu getir
  fetchVideoById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/videos/${id}`);
      set({ video: response.data, loading: false });
    } catch (error) {
      set({ error: "Video bulunamadı.", loading: false });
    }
  },

  // Videoyu sil
  deleteVideo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/videos/${id}`);
      set((state) => ({
        videos: state.videos.filter((video) => video._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Video silinemedi.", loading: false });
    }
  },
}));

export default useVideoStore;