import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "@/constants/config";
import { getToken, removeToken } from "@/utils/storage";
import { router } from "expo-router";

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401, 403, and 429 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401/403 - token expired, invalid, or forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      await removeToken();
      router.replace("/(auth)/login");
    }
    
    if (error.response?.status === 429) {
      // Rate limited - extract Retry-After header
      const retryAfter = error.response.headers?.["retry-after"];
      const message = retryAfter 
        ? `Muitas tentativas. Tente novamente em ${retryAfter} segundos.`
        : "Muitas tentativas. Tente novamente mais tarde.";
      error.message = message;
    }
    
    return Promise.reject(error);
  }
);

export default api;



