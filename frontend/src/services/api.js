import axios from "axios";

const DEFAULT_API_BASE_URL = "https://ai-interview-assistant-u5b2.onrender.com";
const TOKEN_STORAGE_KEY = "auth_token";

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setStoredToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const api = axios.create({
    baseURL:  DEFAULT_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
