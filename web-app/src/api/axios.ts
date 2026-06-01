import axios from "axios";
import { APP_CONFIG } from "../config/app.config";
import { ApiResponse } from "../types";

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: 15000,
});

export const setAuthToken = (token?: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

// Auto-attach stored token on load
const storedToken = localStorage.getItem(APP_CONFIG.localStorageKeys.token);
if (storedToken) {
  setAuthToken(storedToken);
}

export const unwrap = async <T>(promise: Promise<{ data: ApiResponse<T> }>) => {
  const response = await promise;
  return response.data.data;
};

// Response interceptor to handle session expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and user storage, trigger logout or redirect
      localStorage.removeItem(APP_CONFIG.localStorageKeys.token);
      localStorage.removeItem(APP_CONFIG.localStorageKeys.user);
      setAuthToken(null);
      // Optional: Redirect to login or dispatch an event
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);
