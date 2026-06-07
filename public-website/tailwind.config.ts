import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        code: ["Fira Code", "ui-monospace", "monospace"],
      },
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        "background-soft": "rgb(var(--color-background-soft) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        dark: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        peach: "rgb(var(--color-peach) / <alpha-value>)",
        mint: "rgb(var(--color-mint) / <alpha-value>)",
        yellow: "rgb(var(--color-yellow) / <alpha-value>)",
      },
      boxShadow: {
        level1: "0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        level2: "0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.06)",
        level3: "0 12px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
        soft: "0 2px 4px var(--shadow-color), 0 1px 2px var(--shadow-color)",
        elevated: "0 12px 24px var(--shadow-color-strong), 0 4px 8px var(--shadow-color)",
        "primary-glow": "0 8px 18px rgba(99, 91, 255, 0.18)",
      },
      backgroundImage: {
        "app-gradient":
          "linear-gradient(135deg, rgb(var(--gradient-start)) 0%, rgb(var(--gradient-mid)) 48%, rgb(var(--gradient-end)) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
