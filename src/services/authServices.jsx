import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

export const loginAdmin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/login/`, { email, password });
        console.log('API Response:', response.data);
        
        const token = response.data.token;
        console.log("Token received:", token);
        
        if (token) {
            Cookies.set('token', token, { expires: 1 });
            useAuthStore.getState().setToken(token);
            return true; // Başarılı giriş
        }
        return false; // Token yok
    } catch (error) {
        console.error('Login failed:', error);
        return false; // Hata durumu
    }
};