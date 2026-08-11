import { useAuthStore } from "@/features/auth/store/useAuthStore";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token ONLY to /report endpoints
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.url?.includes("/report")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for clean error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
