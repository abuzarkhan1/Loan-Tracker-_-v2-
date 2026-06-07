import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = ({ compact = false }: { compact?: boolean }) => {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-dark shadow-level1 transition duration-150 hover:-translate-y-0.5 hover:bg-background-soft focus:outline-none focus:ring-2 focus:ring-primary/25"
    >
      <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon size={17} strokeWidth={2.5} />
      </span>
      {compact ? null : <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
};
