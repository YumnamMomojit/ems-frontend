import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add a request interceptor to include a mock token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mockToken"); // Or from a context/state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors, e.g., redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("mockToken");
      // Using window.location.href for a full page reload to clear application state
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
