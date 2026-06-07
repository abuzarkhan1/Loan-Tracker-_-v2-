import React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/theme.store";

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggleMode}
      className="flex items-center justify-center rounded-md border border-appBorder bg-appSurface p-2 text-appMuted shadow-level1 transition-all duration-200 hover:text-appText active:scale-95 focus:outline-none focus:ring-2 focus:ring-appPrimary/30"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 animate-in text-appWarning spin-in-45 duration-300" />
      ) : (
        <Moon className="h-5 w-5 animate-in text-appMuted spin-in-45 duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
