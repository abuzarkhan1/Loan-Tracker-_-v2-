export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
  background: string;
  backgroundSoft: string;
  backgroundGradient: string[];
  heroOverlay: string;
  card: string;
  surface: string;
  input: string;
  text: string;
  muted: string;
  primary: string;
  primaryDark: string;
  success: string;
  warning: string;
  danger: string;
  peach: string;
  mint: string;
  yellow: string;
  white: string;
  border: string;
  pill: string;
  footer: string;
  footerText: string;
  footerMuted: string;
  placeholder: string;
};

export const lightTheme: AppTheme = {
  mode: "light",
  background: "#fffaf4",
  backgroundSoft: "#fff7ef",
  backgroundGradient: ["#fff8f0", "#fffaf4", "#ffffff"],
  heroOverlay: "rgba(255, 232, 216, 0.95)",
  card: "#ffffff",
  surface: "#fff7ef",
  input: "#ffffff",
  text: "#25212b",
  muted: "#6f6577",
  primary: "#f36f56",
  primaryDark: "#d95441",
  success: "#1b7d62",
  warning: "#8a6d1f",
  danger: "#d95441",
  peach: "#ffe4d3",
  mint: "#d9f1d7",
  yellow: "#ffd56a",
  white: "#ffffff",
  border: "rgba(80, 61, 52, 0.14)",
  pill: "#fff7ef",
  footer: "#2b2631",
  footerText: "#f5f0eb",
  footerMuted: "#a89fb0",
  placeholder: "rgba(111, 101, 119, 0.6)",
};

export const darkTheme: AppTheme = {
  mode: "dark",
  background: "#1a161f",
  backgroundSoft: "#25212b",
  backgroundGradient: ["#1a161f", "#1e1a24", "#25212b"],
  heroOverlay: "rgba(37, 33, 43, 0.94)",
  card: "#25212b",
  surface: "#2b2631",
  input: "#332d3a",
  text: "#f5f0eb",
  muted: "#a89fb0",
  primary: "#f36f56",
  primaryDark: "#d95441",
  success: "#d9f1d7",
  warning: "#ffd56a",
  danger: "#f36f56",
  peach: "rgba(255, 228, 211, 0.14)",
  mint: "rgba(217, 241, 215, 0.14)",
  yellow: "rgba(255, 213, 106, 0.15)",
  white: "#ffffff",
  border: "rgba(255, 255, 255, 0.08)",
  pill: "#332d3a",
  footer: "#15121a",
  footerText: "#f5f0eb",
  footerMuted: "#a89fb0",
  placeholder: "rgba(168, 159, 176, 0.6)",
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
