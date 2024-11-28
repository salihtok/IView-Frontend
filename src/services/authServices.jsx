import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Login Fonksiyonu
export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/login`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Login Response:", response.data.message);
    return true; // Başarılı giriş
  } catch (error) {
    console.error(
      "Login Error:",
      error.response?.data?.message || error.message
    );
    return false; // Başarısız giriş
  }
};

// Logout Fonksiyonu
export const logoutAdmin = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/login/logout`,
      {},
      { withCredentials: true }
    );
    console.log("Logout successful:", response.data.message);
  } catch (error) {
    console.error(
      "Logout Error:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || { message: "Logout failed" };
  }
};