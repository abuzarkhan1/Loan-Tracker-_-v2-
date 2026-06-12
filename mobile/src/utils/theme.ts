export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
  background: string;
  backgroundSoft: string;
  backgroundGradient: [string, string, string];
  heroOverlay: string;
  card: string;
  surface: string;
  input: string;
  text: string;
  textSecondary: string;
  muted: string;
  primary: string;
  primaryHover: string;
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
  shadowColor: string;
  shadowSoft: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
  shadowElevated: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
};

const premiumDarkTheme: AppTheme = {
  mode: "dark",
  background: "#000000",
  backgroundSoft: "#090909",
  backgroundGradient: ["#000000", "#090909", "#000000"],
  heroOverlay: "rgba(0, 0, 0, 0.95)",
  card: "#0f0f0f",
  surface: "#0f0f0f",
  input: "#141414",
  text: "#ffffff",
  textSecondary: "#a3a3a3",
  muted: "#9c9c9c",
  primary: "#ffffff",
  primaryHover: "#e5e5e5",
  secondary: "#1a1a1a",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  peach: "rgba(239, 68, 68, 0.15)",
  mint: "rgba(34, 197, 94, 0.15)",
  yellow: "rgba(234, 179, 8, 0.15)",
  white: "#ffffff",
  border: "#262626",
  pill: "#141414",
  footer: "#000000",
  footerText: "#ffffff",
  footerMuted: "#a3a3a3",
  placeholder: "rgba(255, 255, 255, 0.4)",
  shadowColor: "rgba(0, 0, 0, 0.8)",
  shadowSoft: {
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  shadowElevated: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};

// Map both light and dark modes to the premium theme to make it dark-first and consistent
export const lightTheme: AppTheme = {
  ...premiumDarkTheme,
  mode: "light",
};

export const darkTheme: AppTheme = premiumDarkTheme;

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export const colors = darkTheme;

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extraBold: "Inter_800ExtraBold",
  code: "FiraCode_400Regular",
};
