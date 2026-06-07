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

const navyShadow = "#0A2540";

export const lightTheme: AppTheme = {
  mode: "light",
  background: "#FFFFFF",
  backgroundSoft: "#F6F9FC",
  backgroundGradient: ["#FFFFFF", "#F6F9FC", "#FFFFFF"],
  heroOverlay: "rgba(246, 249, 252, 0.96)",
  card: "#ffffff",
  surface: "#F6F9FC",
  input: "#ffffff",
  text: "#0A2540",
  textSecondary: "#425466",
  muted: "#697386",
  primary: "#635BFF",
  primaryHover: "#7A73FF",
  secondary: "#0A2540",
  success: "#30B130",
  warning: "#FFBB00",
  danger: "#DF1B41",
  peach: "rgba(223, 27, 65, 0.10)",
  mint: "rgba(48, 177, 48, 0.10)",
  yellow: "rgba(255, 187, 0, 0.12)",
  white: "#ffffff",
  border: "#E3E8EE",
  pill: "#F6F9FC",
  footer: "#0A2540",
  footerText: "#FFFFFF",
  footerMuted: "#A3ACB9",
  placeholder: "rgba(105, 115, 134, 0.64)",
  shadowColor: "rgba(10, 37, 64, 0.08)",
  shadowSoft: {
    shadowColor: navyShadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  shadowElevated: {
    shadowColor: navyShadow,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
  },
};

export const darkTheme: AppTheme = {
  mode: "dark",
  background: "#0B0F19",
  backgroundSoft: "#111827",
  backgroundGradient: ["#111827", "#0B0F19", "#0B0F19"],
  heroOverlay: "rgba(7, 12, 24, 0.94)",
  card: "#151B2B",
  surface: "#111827",
  input: "#0F1623",
  text: "#F0F6FC",
  textSecondary: "#8B9CB5",
  muted: "#8B949E",
  primary: "#7C73FF",
  primaryHover: "#968FFF",
  secondary: "#1E3A5F",
  success: "#3FB950",
  warning: "#D29922",
  danger: "#F85149",
  peach: "rgba(248, 81, 73, 0.15)",
  mint: "rgba(63, 185, 80, 0.15)",
  yellow: "rgba(210, 153, 34, 0.15)",
  white: "#ffffff",
  border: "#2A3441",
  pill: "#111827",
  footer: "#070C18",
  footerText: "#F0F6FC",
  footerMuted: "#8B9CB5",
  placeholder: "rgba(139, 156, 181, 0.62)",
  shadowColor: "rgba(0, 0, 0, 0.3)",
  shadowSoft: {
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  shadowElevated: {
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 9,
  },
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export const colors = lightTheme;

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extraBold: "Inter_800ExtraBold",
  code: "FiraCode_400Regular",
};
