import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Her istekte token'ı otomatik ekle
instance.interceptors.request.use((config) => {
  // JSON isteklerinde 'Content-Type: application/json' başlığını ekleyin
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default instance;

export const setAuthRedirect = (navigate) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token geçersiz, kullanıcıyı admin-login sayfasına yönlendir
        navigate("/admin-login"); // useNavigate ile yönlendirme
      }
      return Promise.reject(error);
    }
  );
};