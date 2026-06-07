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
  textSecondary: string;
  muted: string;
  primary: string;
  primaryHover: string;
  primaryDark: string;
  secondary: string;
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
  background: "#ffffff",
  backgroundSoft: "#f6f9fc",
  backgroundGradient: ["#ffffff", "#f6f9fc", "#ffffff"],
  heroOverlay: "rgba(246, 249, 252, 0.96)",
  card: "#ffffff",
  surface: "#f6f9fc",
  input: "#ffffff",
  text: "#0a2540",
  textSecondary: "#425466",
  muted: "#697386",
  primary: "#635bff",
  primaryHover: "#7a73ff",
  primaryDark: "#4f46e5",
  secondary: "#0a2540",
  success: "#30b130",
  warning: "#ffbb00",
  danger: "#df1b41",
  peach: "rgba(223, 27, 65, 0.10)",
  mint: "rgba(48, 177, 48, 0.10)",
  yellow: "rgba(255, 187, 0, 0.12)",
  white: "#ffffff",
  border: "#e3e8ee",
  pill: "#f6f9fc",
  footer: "#0a2540",
  footerText: "#ffffff",
  footerMuted: "#a3acb9",
  placeholder: "rgba(105, 115, 134, 0.64)",
};

export const darkTheme: AppTheme = {
  mode: "dark",
  background: "#0b0f19",
  backgroundSoft: "#111827",
  backgroundGradient: ["#111827", "#0b0f19"],
  heroOverlay: "rgba(7, 12, 24, 0.94)",
  card: "#151b2b",
  surface: "#111827",
  input: "#0f1623",
  text: "#f0f6fc",
  textSecondary: "#8b9cb5",
  muted: "#8b949e",
  primary: "#7c73ff",
  primaryHover: "#968fff",
  primaryDark: "#635bff",
  secondary: "#1e3a5f",
  success: "#3fb950",
  warning: "#d29922",
  danger: "#f85149",
  peach: "rgba(248, 81, 73, 0.15)",
  mint: "rgba(63, 185, 80, 0.15)",
  yellow: "rgba(210, 153, 34, 0.15)",
  white: "#ffffff",
  border: "#2a3441",
  pill: "#111827",
  footer: "#070c18",
  footerText: "#f0f6fc",
  footerMuted: "#8b9cb5",
  placeholder: "rgba(139, 156, 181, 0.62)",
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
