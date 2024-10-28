import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Her istekte token'ı otomatik ekle
instance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Yanıt interceptor'ı ekleyerek 401 hatasında yönlendirme yapın
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token geçersiz, kullanıcıyı admin-login sayfasına yönlendir
      useAuthStore.getState().clearAuth(); // Token'ı temizleyin
      navigate("/admin-login"); // Admin-login sayfasına yönlendirin
    }
    return Promise.reject(error);
  }
);

export default instance;