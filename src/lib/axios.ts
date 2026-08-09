import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for clean error handling if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
