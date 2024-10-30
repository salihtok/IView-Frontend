import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Her istekte token'ı otomatik ekle
instance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // JSON isteklerinde 'Content-Type: application/json' başlığını ekleyin
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Yanıt interceptor'ı ekleyerek 401 hatasında yönlendirme yapın
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token geçersiz, kullanıcıyı admin-login sayfasına yönlendir
      useAuthStore.getState().clearAuth(); // Token'ı temizleyin
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default instance;