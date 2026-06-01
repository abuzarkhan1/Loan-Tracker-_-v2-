import { create } from "zustand";
import { APP_CONFIG } from "../config/app.config";
import type { ThemeMode } from "../config/theme.config";


type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  initialize: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",

  initialize: () => {
    const stored = localStorage.getItem(APP_CONFIG.localStorageKeys.theme) as ThemeMode | null;
    const initialMode = stored || "light";
    set({ mode: initialMode });
    
    // Apply class to HTML
    if (initialMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  setMode: (mode) => {
    localStorage.setItem(APP_CONFIG.localStorageKeys.theme, mode);
    set({ mode });
    
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggleMode: () => {
    const nextMode = get().mode === "light" ? "dark" : "light";
    get().setMode(nextMode);
  },
}));
