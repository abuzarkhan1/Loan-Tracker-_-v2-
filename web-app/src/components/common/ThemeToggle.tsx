import React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/theme.store";

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggleMode}
      className="flex items-center justify-center p-2 text-appMuted hover:text-appText bg-appBgSoft rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-appBorder shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary/40"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-appYellow animate-in spin-in-45 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-[#6f6577] animate-in spin-in-45 duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
