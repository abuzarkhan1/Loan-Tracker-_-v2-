import { create } from "zustand";
import { authApi } from "../api/auth.api";
import { setAuthToken } from "../api/axios";
import type { User } from "../types";

import { APP_CONFIG } from "../config/app.config";

type AuthState = {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<User>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isBootstrapping: true,

  bootstrap: async () => {
    try {
      const storedToken = localStorage.getItem(APP_CONFIG.localStorageKeys.token);
      const storedUser = localStorage.getItem(APP_CONFIG.localStorageKeys.user);

      if (!storedToken) {
        set({ isBootstrapping: false });
        return;
      }

      setAuthToken(storedToken);
      set({ 
        token: storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
      });

      // Fetch fresh profile
      const freshUser = await authApi.me();
      localStorage.setItem(APP_CONFIG.localStorageKeys.user, JSON.stringify(freshUser));
      set({ user: freshUser, isBootstrapping: false });
    } catch {
      await get().logout();
    } finally {
      set({ isBootstrapping: false });
    }
  },

  login: async (payload) => {
    const session = await authApi.login(payload);
    setAuthToken(session.token);
    localStorage.setItem(APP_CONFIG.localStorageKeys.token, session.token);
    localStorage.setItem(APP_CONFIG.localStorageKeys.user, JSON.stringify(session.user));
    set({ token: session.token, user: session.user });
  },

  register: async (payload) => {
    const session = await authApi.register(payload);
    setAuthToken(session.token);
    localStorage.setItem(APP_CONFIG.localStorageKeys.token, session.token);
    localStorage.setItem(APP_CONFIG.localStorageKeys.user, JSON.stringify(session.user));
    set({ token: session.token, user: session.user });
  },

  updateProfile: async (payload) => {
    const freshUser = await authApi.updateMe(payload);
    localStorage.setItem(APP_CONFIG.localStorageKeys.user, JSON.stringify(freshUser));
    set({ user: freshUser });
    return freshUser;
  },

  logout: async () => {
    setAuthToken(null);
    localStorage.removeItem(APP_CONFIG.localStorageKeys.token);
    localStorage.removeItem(APP_CONFIG.localStorageKeys.user);
    set({ token: null, user: null, isBootstrapping: false });
  },
}));
